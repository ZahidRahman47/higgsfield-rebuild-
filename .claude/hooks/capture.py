#!/usr/bin/env python3
"""8x agent capture hook for Claude Code.

Wired in .claude/settings.json to SessionStart, UserPromptSubmit and Stop.
- UserPromptSubmit: appends the verbatim prompt to .agent-logs/<time>_<session>.md
- Stop: reads the session transcript and appends the final assistant response
- SessionStart: remembers the model name so the first prompt entry can carry it
Never blocks Claude: on any error it writes to stderr and exits 0.
"""
import glob
import json
import os
import re
import sys
import time
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
STATE_DIR = os.path.join(HERE, ".state")


def now_iso():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.") + \
        "%03dZ" % (datetime.now(timezone.utc).microsecond // 1000)


def load_metadata():
    with open(os.path.join(HERE, "capture-metadata.json")) as f:
        return json.load(f)


def project_root(event):
    return os.environ.get("CLAUDE_PROJECT_DIR") or event.get("cwd") or os.getcwd()


def read_transcript(path):
    entries = []
    if not path or not os.path.exists(path):
        return entries
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                entries.append(json.loads(line))
            except ValueError:
                pass
    return entries


def model_from_transcript(entries):
    for e in reversed(entries):
        if e.get("type") == "assistant" and not e.get("isSidechain"):
            m = (e.get("message") or {}).get("model")
            if m and m != "<synthetic>":
                return m
    return None


def state_file(session_id):
    os.makedirs(STATE_DIR, exist_ok=True)
    return os.path.join(STATE_DIR, "%s.json" % session_id)


def get_state(session_id):
    try:
        with open(state_file(session_id)) as f:
            return json.load(f)
    except (OSError, ValueError):
        return {}


def put_state(session_id, state):
    with open(state_file(session_id), "w") as f:
        json.dump(state, f)


def log_path_for(root, session_id, first_time):
    logs = os.path.join(root, ".agent-logs")
    os.makedirs(logs, exist_ok=True)
    existing = sorted(glob.glob(os.path.join(logs, "*_%s.md" % session_id)))
    if existing:
        return existing[0]
    stamp = first_time[:19].replace("T", "_").replace(":", "-")
    return os.path.join(logs, "%s_%s.md" % (stamp, session_id))


def write_header(path, session_id, first_time, model, meta):
    date = first_time[:10]
    header = "\n".join([
        "---",
        "session_id: %s" % session_id,
        "date: %s" % date,
        "author: %s" % meta["author"],
        "model: %s" % model,
        "tool: %s" % meta["tool"],
        "project: %s" % meta["project"],
        "total_exchanges: 0",
        "first_prompt_time: %s" % first_time,
        "last_prompt_time: %s" % first_time,
        "---",
        "",
        "# Session Log - %s" % date,
        "",
        "Session: `%s` | Project: `%s` | Author: `%s`" % (session_id[:8], meta["project"], meta["author"]),
        "",
        "---",
        "",
    ])
    with open(path, "w", encoding="utf-8") as f:
        f.write(header + "\n")


def update_header(path, count, last_prompt_time=None, model=None):
    with open(path, encoding="utf-8") as f:
        text = f.read()
    head, sep, body = text.partition("\n---\n\n# Session Log")
    head = re.sub(r"^total_exchanges: .*$", "total_exchanges: %d" % count, head, flags=re.M)
    if last_prompt_time:
        head = re.sub(r"^last_prompt_time: .*$", "last_prompt_time: %s" % last_prompt_time, head, flags=re.M)
    if model:
        # header model lists every model seen, in order, so a mid-build switch is visible
        cur = re.search(r"^model: (.*)$", head, re.M).group(1)
        seen = [m.strip() for m in cur.split(",") if m.strip() and m.strip() != "unknown"]
        if model not in seen:
            seen.append(model)
            head = re.sub(r"^model: .*$", "model: %s" % ", ".join(seen), head, flags=re.M)
    with open(path, "w", encoding="utf-8") as f:
        f.write(head + sep + body)


def append_entry(path, kind, num, session_id, ts, model, content):
    entry = "[LOG_ENTRY type=%s num=%d session=%s]\ntimestamp: %s\nmodel: %s\n\n%s\n\n\n" % (
        kind, num, session_id[:8], ts, model, content.rstrip("\n"))
    with open(path, "a", encoding="utf-8") as f:
        f.write(entry)


def is_real_prompt(e):
    if e.get("type") != "user" or e.get("isSidechain") or e.get("isMeta"):
        return False
    content = (e.get("message") or {}).get("content")
    if isinstance(content, str):
        return True
    if isinstance(content, list):
        return not any(isinstance(b, dict) and b.get("type") == "tool_result" for b in content)
    return False


def final_response(entries):
    """Text of the last assistant message of the current turn (after its last tool call)."""
    start = 0
    for i, e in enumerate(entries):
        if is_real_prompt(e):
            start = i + 1
    texts, ts, model = [], None, None
    for e in entries[start:]:
        if e.get("isSidechain"):
            continue
        if e.get("type") == "user":
            # a tool result: anything before it was intermediate, not the final reply
            texts = []
            continue
        if e.get("type") != "assistant":
            continue
        msg = e.get("message") or {}
        blocks = msg.get("content") or []
        if isinstance(blocks, str):
            blocks = [{"type": "text", "text": blocks}]
        for b in blocks:
            if b.get("type") == "tool_use":
                texts = []
            elif b.get("type") == "text" and b.get("text"):
                texts.append(b["text"])
                ts = e.get("timestamp")
                if msg.get("model") and msg.get("model") != "<synthetic>":
                    model = msg["model"]
    return "\n\n".join(texts), ts, model


def on_session_start(event):
    sid = event["session_id"]
    st = get_state(sid)
    model = event.get("model")
    if isinstance(model, dict):
        model = model.get("id") or model.get("display_name")
    if model:
        st["model"] = model
        put_state(sid, st)


def on_prompt(event):
    sid = event["session_id"]
    root = project_root(event)
    meta = load_metadata()
    st = get_state(sid)
    model = model_from_transcript(read_transcript(event.get("transcript_path"))) \
        or st.get("model") or meta.get("model") or "unknown"
    ts = now_iso()
    path = log_path_for(root, sid, ts)
    if not os.path.exists(path):
        write_header(path, sid, ts, model, meta)
    # count prompts in session state, not by scanning the log: a response that
    # quotes a "[LOG_ENTRY type=PROMPT" line would otherwise be counted as a prompt
    num = st.get("num", 0) + 1
    append_entry(path, "PROMPT", num, sid, ts, model, event.get("prompt", ""))
    update_header(path, num, last_prompt_time=ts, model=model)
    st.update({"num": num, "responded": False, "model": model})
    put_state(sid, st)


def on_stop(event):
    sid = event["session_id"]
    root = project_root(event)
    st = get_state(sid)
    if not st.get("num") or st.get("responded"):
        return
    text, ts, model = "", None, None
    # the transcript can lag the Stop event slightly; retry briefly
    for _ in range(10):
        text, ts, model = final_response(read_transcript(event.get("transcript_path")))
        if text.strip():
            break
        time.sleep(0.3)
    if not text.strip():
        text = event.get("last_assistant_message") or "(no final text response found in transcript)"
    model = model or st.get("model") or "unknown"
    path = log_path_for(root, sid, now_iso())
    append_entry(path, "RESPONSE", st["num"], sid, now_iso(), model, text)
    update_header(path, st["num"], model=model)
    st.update({"responded": True, "model": model})
    put_state(sid, st)


def main():
    try:
        event = json.load(sys.stdin)
        name = event.get("hook_event_name")
        if name == "SessionStart":
            on_session_start(event)
        elif name == "UserPromptSubmit":
            on_prompt(event)
        elif name == "Stop":
            on_stop(event)
    except Exception as exc:  # never block the agent
        sys.stderr.write("8x capture hook failed: %r\n" % (exc,))
    sys.exit(0)


if __name__ == "__main__":
    main()
