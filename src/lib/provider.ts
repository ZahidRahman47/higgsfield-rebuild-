import "server-only";

// The one place that knows which image model we call. Swap this to change provider.
// Pollinations is free and keyless but sheds load with fast 402/429s, so retry those.

const RETRYABLE = new Set([402, 429, 500, 502, 503, 504]);

export async function generateImage(prompt: string, w: number, h: number, seed: number, enhance: boolean) {
  const qs = new URLSearchParams({
    width: String(w),
    height: String(h),
    seed: String(seed),
    nologo: "true",
    referrer: "higgsfield-rebuild",
  });
  if (enhance) qs.set("enhance", "true");
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${qs}`;

  let last = 0;
  for (let attempt = 0; attempt < 8; attempt++) {
    const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(45_000) }).catch(() => null);
    if (res?.ok && res.headers.get("content-type")?.startsWith("image/")) {
      return { body: await res.arrayBuffer(), type: res.headers.get("content-type")! };
    }
    last = res?.status ?? 0;
    if (res && !RETRYABLE.has(res.status)) break;
    await new Promise((r) => setTimeout(r, 1500 + attempt * 1000));
  }
  throw new Error(`Provider failed (${last})`);
}
