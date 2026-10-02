'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

function readEvent() {
  return JSON.parse(fs.readFileSync(0, 'utf8'));
}

function eventTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error('Hook event has an invalid timestamp');
  return date.toISOString();
}

function quoteSql(value) {
  return `'${value.replaceAll("'", "''")}'`;
}

function makeFence(value) {
  const runs = value.match(/`+/g) || [];
  return '`'.repeat(Math.max(3, ...runs.map((run) => run.length + 1)));
}

function fencedText(value) {
  const fence = makeFence(value);
  return `${fence}\n${value}${value.endsWith('\n') ? '' : '\n'}${fence}`;
}

function statePath(root, sessionId) {
  const workspaceHash = crypto.createHash('sha256').update(root).digest('hex').slice(0, 16);
  return path.join(os.tmpdir(), '8x-agent-capture', workspaceHash, `${sessionId}.json`);
}

function sessionDatabase() {
  if (process.env.EIGHTX_SESSION_DB) return process.env.EIGHTX_SESSION_DB;
  if (process.platform === 'darwin') {
    return path.join(
      os.homedir(),
      'Library',
      'Application Support',
      'Code',
      'User',
      'globalStorage',
      'github.copilot-chat',
      'session-store.db',
    );
  }
  throw new Error('Set EIGHTX_SESSION_DB to the VS Code Copilot session-store.db path on this OS');
}

function loadLatestTurn(database, sessionId) {
  const query = `SELECT turn_index, user_message, assistant_response, timestamp FROM turns WHERE session_id = ${quoteSql(sessionId)} ORDER BY turn_index DESC LIMIT 1;`;
  const output = execFileSync('sqlite3', ['-json', database, query], { encoding: 'utf8' });
  const rows = JSON.parse(output || '[]');
  return rows[0];
}

function makeLogPath(root, timestamp, sessionId) {
  const date = new Date(timestamp);
  const filenameTime = date.toISOString().replace(/:/g, '-').replace(/\.\d{3}Z$/, '').replace('T', '_');
  return path.join(root, '.agent-logs', `${filenameTime}_${sessionId}.md`);
}

function initializeLog(logPath, event, metadata) {
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  if (fs.existsSync(logPath)) return;
  const firstPromptTime = eventTime(event.timestamp);
  const date = firstPromptTime.slice(0, 10);
  const header = [
    '---',
    `session_id: ${event.session_id}`,
    `date: ${date}`,
    `author: ${JSON.stringify(metadata.author)}`,
    `model: ${JSON.stringify(metadata.model)}`,
    `tool: ${metadata.tool}`,
    `project: ${metadata.project}`,
    'total_exchanges: 0',
    `first_prompt_time: ${firstPromptTime}`,
    `last_prompt_time: ${firstPromptTime}`,
    '---',
    '',
    `# Session Log - ${date}`,
    '',
    `Session: \`${event.session_id.slice(0, 8)}\` | Project: ${metadata.project} | Author: ${metadata.author}`,
    '',
    '---',
    '',
  ].join('\n');
  fs.writeFileSync(logPath, header, { flag: 'wx' });
}

function updateSummary(logPath, promptTime) {
  const contents = fs.readFileSync(logPath, 'utf8');
  const exchangeCount = (contents.match(/\[LOG_ENTRY type=PROMPT/g) || []).length;
  const withCount = contents.replace(/^total_exchanges: \d+$/m, `total_exchanges: ${exchangeCount}`);
  const updated = withCount.replace(/^last_prompt_time: .*$/m, `last_prompt_time: ${promptTime}`);
  fs.writeFileSync(logPath, updated);
}

function handlePrompt(event, metadata) {
  const root = event.cwd;
  const sessionId = event.session_id;
  if (!root || !sessionId || !/^[a-f\d-]+$/i.test(sessionId) || typeof event.prompt !== 'string') {
    throw new Error('UserPromptSubmit event is missing a valid cwd, session_id, or prompt');
  }
  const timestamp = eventTime(event.timestamp);
  const logPath = makeLogPath(root, timestamp, sessionId);
  const pendingPath = statePath(root, sessionId);
  fs.mkdirSync(path.dirname(pendingPath), { recursive: true });
  fs.writeFileSync(pendingPath, JSON.stringify({ root, sessionId, timestamp, prompt: event.prompt, logPath, model: metadata.model }));
  process.stdout.write('{}');
}

function handleStop(event, metadata) {
  const root = event.cwd;
  const sessionId = event.session_id;
  if (!root || !sessionId || !/^[a-f\d-]+$/i.test(sessionId)) {
    throw new Error('Stop event is missing a valid cwd or session_id');
  }
  const pendingPath = statePath(root, sessionId);
  if (!fs.existsSync(pendingPath)) {
    throw new Error(`No pending prompt found for Copilot session ${sessionId}`);
  }
  const pending = JSON.parse(fs.readFileSync(pendingPath, 'utf8'));
  const turn = loadLatestTurn(sessionDatabase(), sessionId);
  if (!turn || turn.user_message !== pending.prompt || typeof turn.assistant_response !== 'string') {
    throw new Error('The latest VS Code turn does not match the pending prompt; capture was not written');
  }
  if (!turn.assistant_response.trim()) throw new Error('The final assistant response is empty');

  initializeLog(pending.logPath, { ...event, timestamp: pending.timestamp }, metadata);
  const promptTime = pending.timestamp;
  const responseTime = eventTime(event.timestamp);
  const promptNumber = (fs.readFileSync(pending.logPath, 'utf8').match(/\[LOG_ENTRY type=PROMPT/g) || []).length + 1;
  const entry = [
    `[LOG_ENTRY type=PROMPT num=${promptNumber} session=${sessionId}]`,
    `timestamp: ${promptTime}`,
    `model: ${pending.model}`,
    '',
    fencedText(pending.prompt),
    '',
    `[LOG_ENTRY type=RESPONSE num=${promptNumber} session=${sessionId}]`,
    `timestamp: ${responseTime}`,
    `model: ${pending.model}`,
    '',
    fencedText(turn.assistant_response),
    '',
    '---',
    '',
  ].join('\n');
  fs.appendFileSync(pending.logPath, entry);
  updateSummary(pending.logPath, promptTime);
  fs.unlinkSync(pendingPath);
  process.stdout.write('{}');
}

try {
  const event = readEvent();
  const metadataPath = path.join(__dirname, 'capture-metadata.json');
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  if (event.hook_event_name === 'UserPromptSubmit') {
    handlePrompt(event, metadata);
  } else if (event.hook_event_name === 'Stop') {
    handleStop(event, metadata);
  } else {
    throw new Error(`Unsupported hook event: ${event.hook_event_name || 'unknown'}`);
  }
} catch (error) {
  process.stderr.write(`8x capture hook failed: ${error.message}\n`);
  process.exitCode = 1;
}