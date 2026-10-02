import { generateImage } from "@/lib/provider";
import { styleById } from "@/lib/generate";

export const maxDuration = 60;

const clamp = (v: string | null, min: number, max: number, d: number) =>
  Math.min(max, Math.max(min, Number.parseInt(v ?? "", 10) || d));

// GET /api/image?prompt&style&w&h&seed&enhance → image bytes.
// The output is fully determined by the query, so it's cached as immutable at the CDN.
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const prompt = (q.get("prompt") ?? "").trim().slice(0, 1000);
  if (!prompt) return new Response("Missing prompt", { status: 400 });

  const full = [prompt, styleById(q.get("style") ?? "none").suffix].filter(Boolean).join(", ");
  try {
    const img = await generateImage(
      full,
      clamp(q.get("w"), 256, 1536, 768),
      clamp(q.get("h"), 256, 1536, 1024),
      clamp(q.get("seed"), 0, 2_147_483_647, 42),
      q.get("enhance") === "1",
    );
    return new Response(img.body, {
      headers: { "Content-Type": img.type, "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch (e) {
    return new Response((e as Error).message, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
