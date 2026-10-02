"use client";

import Image from "next/image";
import { useInfiniteQuery } from "@tanstack/react-query";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import Lightbox from "@/components/Lightbox";
import { styleIdOf, type ShowcaseItem } from "@/lib/showcase";
import { useColumns } from "@/lib/use-columns";

const FILTERS = ["All", "Cinematic", "Photoreal", "Product", "Fashion", "Anime", "3D"];

type Page = { items: ShowcaseItem[]; next: number | null };

export default function Feed() {
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState<ShowcaseItem | null>(null);
  const cols = useColumns();

  // each filter is its own cached query, so switching back is instant
  const q = useInfiniteQuery({
    queryKey: ["feed", filter],
    queryFn: async ({ pageParam }): Promise<Page> => {
      const res = await fetch(`/api/feed?cursor=${pageParam}&style=${encodeURIComponent(filter)}`);
      if (!res.ok) throw new Error("Feed failed");
      return res.json();
    },
    initialPageParam: 0,
    getNextPageParam: (last) => last.next,
  });

  const items = useMemo(() => q.data?.pages.flatMap((p) => p.items) ?? [], [q.data]);

  // shortest-column masonry: appending a page never reshuffles cards already placed
  const columns = useMemo(() => {
    const out: ShowcaseItem[][] = Array.from({ length: cols }, () => []);
    const heights = new Array(cols).fill(0);
    for (const it of items) {
      const i = heights.indexOf(Math.min(...heights));
      out[i].push(it);
      heights[i] += it.h / it.w;
    }
    return out;
  }, [items, cols]);

  const sentinel = useRef<HTMLDivElement>(null);
  const { hasNextPage, isFetchingNextPage, fetchNextPage } = q;
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && hasNextPage && !isFetchingNextPage && fetchNextPage(),
      { rootMargin: "800px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="display text-3xl sm:text-4xl">Made with Higgsfield Rebuild</h2>
          <p className="text-muted">Open any creation and recreate it with one click.</p>
        </div>
      </div>
      <div className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              "shrink-0 rounded-full border px-4 py-1.5 text-sm transition-colors",
              f === filter ? "border-lime bg-lime text-black" : "border-line bg-card text-muted hover:text-white",
            )}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        {columns.map((col, i) => (
          <div key={i} className="flex min-w-0 flex-1 flex-col gap-3">
            {col.map((it, j) => (
              <FeedCard key={it.id} item={it} priority={j === 0 && i < 4} onOpen={setOpen} />
            ))}
          </div>
        ))}
      </div>
      {q.isPending && <SkeletonGrid cols={cols} />}
      <div ref={sentinel} className="h-px" />
      {open && (
        <Lightbox item={{ ...open, style: styleIdOf(open.style) }} onClose={() => setOpen(null)} />
      )}
    </section>
  );
}

// memo: cards don't re-render when later pages arrive or the lightbox opens
const FeedCard = memo(function FeedCard({
  item,
  priority,
  onOpen,
}: {
  item: ShowcaseItem;
  priority: boolean;
  onOpen: (i: ShowcaseItem) => void;
}) {
  return (
    <button onClick={() => onOpen(item)} className="group relative block overflow-hidden rounded-xl bg-card text-left">
      <Image
        src={item.src}
        alt={item.prompt}
        width={item.w}
        height={item.h}
        placeholder="blur"
        blurDataURL={item.blur}
        priority={priority}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-10 opacity-0 transition-opacity group-hover:opacity-100">
        <span className="mb-1 inline-block rounded bg-white/15 px-1.5 py-0.5 text-[11px] backdrop-blur">{item.style}</span>
        <p className="line-clamp-2 text-sm">{item.prompt}</p>
      </div>
    </button>
  );
});

function SkeletonGrid({ cols }: { cols: number }) {
  return (
    <div className="flex gap-3">
      {Array.from({ length: cols }, (_, i) => (
        <div key={i} className="flex flex-1 flex-col gap-3">
          <div className="shimmer relative aspect-[3/4] overflow-hidden rounded-xl bg-card" />
          <div className="shimmer relative aspect-square overflow-hidden rounded-xl bg-card" />
        </div>
      ))}
    </div>
  );
}
