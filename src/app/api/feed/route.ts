import { SHOWCASE } from "@/lib/showcase";

// GET /api/feed?cursor=0&style=Cinematic → a page of public creations.
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const style = q.get("style");
  const cursor = Number(q.get("cursor") ?? 0) || 0;
  const limit = 8;
  const all = style && style !== "All" ? SHOWCASE.filter((s) => s.style === style) : SHOWCASE;
  const items = all.slice(cursor, cursor + limit);
  const next = cursor + limit < all.length ? cursor + limit : null;
  return Response.json(
    { items, next },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
  );
}
