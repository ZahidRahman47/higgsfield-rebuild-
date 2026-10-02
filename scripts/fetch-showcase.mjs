// One-off: generate the Explore showcase via Pollinations and save optimized
// webp + a tiny blur placeholder, so the landing page never waits on the API.
import fs from "node:fs/promises";
import sharp from "sharp";

const items = JSON.parse(await fs.readFile("scripts/showcase-prompts.json", "utf8"));
await fs.mkdir("public/showcase", { recursive: true });
const out = [];
for (const [i, it] of items.entries()) {
  const file = `public/showcase/${it.id}.webp`;
  const seed = 1000 + i;
  let buf;
  try {
    buf = await fs.readFile(file);
  } catch {
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(it.prompt)}?width=${it.w}&height=${it.h}&seed=${seed}&nologo=true`;
    for (let attempt = 0; attempt < 12 && !buf; attempt++) {
      const res = await fetch(url);
      if (res.ok) buf = await sharp(Buffer.from(await res.arrayBuffer())).webp({ quality: 78 }).toBuffer();
      else await new Promise((r) => setTimeout(r, 3000));
    }
    if (!buf) { console.error("failed", it.id); continue; }
    await fs.writeFile(file, buf);
  }
  const meta = await sharp(buf).metadata();
  const blur = await sharp(buf).resize(12).webp({ quality: 40 }).toBuffer();
  out.push({ ...it, seed, w: meta.width, h: meta.height, src: `/showcase/${it.id}.webp`,
    blur: `data:image/webp;base64,${blur.toString("base64")}` });
  console.log("ok", it.id, meta.width, meta.height, buf.length);
}
await fs.writeFile("src/data/showcase.json", JSON.stringify(out, null, 1));
