import Link from "next/link";
import clsx from "clsx";
import Photo from "./Photo";
import { ViewAll } from "./SectionHead";
import type { Photo as P } from "@/lib/media";

/**
 * Higgsfield-style gallery: a masonry wall cut off with a fade and a "View all" pill.
 * Pure CSS columns, so it renders on the server with zero client JS.
 */
export default function Masonry({
  photos, cols = 4, height = "h-[760px]", view, mode = "masonry", to,
}: {
  photos: P[];
  cols?: 4 | 5;
  height?: string;
  view: { label: string; href: string };
  mode?: "masonry" | "grid";
  /** where a tile leads: Create, prefilled with the photo's description as the prompt */
  to: (p: P) => string;
}) {
  return (
    <div className={clsx("relative overflow-hidden", height)}>
      {mode === "masonry" ? (
        <div className={clsx("columns-2 gap-2 sm:columns-3", cols === 5 ? "lg:columns-5" : "lg:columns-4")}>
          {photos.map((p) => (
            <Tile key={p.id} p={p} href={to(p)} className="mb-2 break-inside-avoid" sizes={`(max-width: 640px) 50vw, (max-width: 1024px) 33vw, ${cols === 5 ? 20 : 25}vw`} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((p) => (
            <Tile key={p.id} p={p} href={to(p)} className="aspect-video" fill sizes="(max-width: 640px) 50vw, 25vw" />
          ))}
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-bg via-bg/80 to-transparent" />
      <ViewAll {...view} />
    </div>
  );
}

function Tile({ p, href, className, sizes, fill }: { p: P; href: string; className?: string; sizes: string; fill?: boolean }) {
  return (
    <Link href={href} className={clsx("group relative block overflow-hidden rounded-xl", className)}>
      <Photo p={p} sizes={sizes} fill={fill} className="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]" />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-6 text-xs text-white/80 opacity-0 transition-opacity group-hover:opacity-100">
        Recreate this · photo by {p.author}
      </span>
    </Link>
  );
}
