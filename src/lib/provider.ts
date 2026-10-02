import "server-only";
import sharp from "sharp";

// The one place that knows which image model we call.
//  - Cloudflare Workers AI (FLUX.1 schnell) when CF_ACCOUNT_ID + CF_API_TOKEN are set:
//    fast (~2s) with a free daily allowance. It only renders 1024², so we crop to aspect.
//  - otherwise Pollinations: free and keyless, but rate-limited per IP and sheds load
//    with quick 402/429s, so we retry.

type Out = { body: ArrayBuffer; type: string };

export async function generateImage(prompt: string, w: number, h: number, seed: number, enhance: boolean): Promise<Out> {
  const { CF_ACCOUNT_ID, CF_API_TOKEN } = process.env;
  if (CF_ACCOUNT_ID && CF_API_TOKEN) return cloudflare(prompt, w, h, seed, enhance, CF_ACCOUNT_ID, CF_API_TOKEN);
  return pollinations(prompt, w, h, seed, enhance);
}

async function cloudflare(prompt: string, w: number, h: number, seed: number, enhance: boolean, account: string, token: string): Promise<Out> {
  const full = enhance ? `${prompt}, highly detailed, sharp focus, professional lighting, rich color` : prompt;
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/ai/run/@cf/black-forest-labs/flux-1-schnell`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: full.slice(0, 2048), steps: 6, seed }),
    signal: AbortSignal.timeout(45_000),
  });
  const json = (await res.json().catch(() => null)) as { result?: { image?: string }; errors?: { message: string }[] } | null;
  const b64 = json?.result?.image;
  if (!res.ok || !b64) throw new Error(`Cloudflare failed (${res.status}) ${json?.errors?.[0]?.message ?? ""}`);
  const out = await sharp(Buffer.from(b64, "base64"))
    .resize(w, h, { fit: "cover", position: "attention" })
    .webp({ quality: 82 })
    .toBuffer();
  return { body: new Uint8Array(out).buffer, type: "image/webp" };
}

const RETRYABLE = new Set([402, 429, 500, 502, 503, 504]);

async function pollinations(prompt: string, w: number, h: number, seed: number, enhance: boolean): Promise<Out> {
  const qs = new URLSearchParams({ width: String(w), height: String(h), seed: String(seed), nologo: "true", referrer: "higgsfield-rebuild" });
  if (enhance) qs.set("enhance", "true");
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${qs}`;

  const deadline = Date.now() + 52_000; // stay inside the 60s function limit
  let last = 0;
  for (let attempt = 0; Date.now() < deadline; attempt++) {
    const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(Math.max(1000, deadline - Date.now())) }).catch(() => null);
    if (res?.ok && res.headers.get("content-type")?.startsWith("image/")) {
      return { body: await res.arrayBuffer(), type: res.headers.get("content-type")! };
    }
    last = res?.status ?? 0;
    if (res && !RETRYABLE.has(res.status)) break;
    await new Promise((r) => setTimeout(r, Math.min(8000, 2000 + attempt * 1500)));
  }
  throw new Error(`Provider failed (${last})`);
}
