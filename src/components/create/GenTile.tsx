"use client";

import { memo, useEffect, useState } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import type { Generation } from "@/lib/store";
import { motionById } from "@/lib/motion";
import { styleById } from "@/lib/generate";

/** One generation: shimmer while pending, the image when ready, retry when failed. */
export default memo(function GenTile({
  g,
  onOpen,
  onRetry,
}: {
  g: Generation;
  onOpen: (g: Generation) => void;
  onRetry: (g: Generation) => void;
}) {
  const motion = g.kind === "video" ? motionById(g.motion) : null;
  return (
    <div className="relative overflow-hidden rounded-xl bg-card" style={{ aspectRatio: `${g.w} / ${g.h}` }}>
      {g.status === "pending" && <Pending since={g.createdAt} />}
      {g.status === "failed" && (
        <div className="absolute inset-0 grid place-items-center p-3 text-center">
          <div>
            <AlertTriangle className="mx-auto mb-2 size-5 text-pink" />
            <p className="text-sm">Generation failed</p>
            <p className="mb-3 text-xs text-muted">Credits were refunded</p>
            <button onClick={() => onRetry(g)} className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20">
              <RotateCcw className="size-3.5" /> Retry · {g.cost}
            </button>
          </div>
        </div>
      )}
      {g.status === "ready" && (
        <button onClick={() => onOpen(g)} className="group absolute inset-0 overflow-hidden">
          {/* plain img on purpose: /api/image is already CDN-cached, the optimizer would re-fetch a slow generation */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={g.url}
            alt={g.prompt}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-play"
            style={motion ? { animation: motion.anim } : undefined}
          />
          <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-3 pb-2.5 pt-8 text-left opacity-0 transition-opacity group-hover:opacity-100">
            <span className="mb-1 inline-block rounded bg-white/15 px-1.5 py-0.5 text-[11px] backdrop-blur">{styleById(g.style).label} · {g.aspect}</span>
            <span className="line-clamp-2 text-xs text-white/90">{g.prompt}</span>
          </span>
          {motion && (
            <span className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-0.5 text-xs backdrop-blur">
              {motion.glyph} {motion.label}
            </span>
          )}
        </button>
      )}
    </div>
  );
});

function Pending({ since }: { since: number }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const s = Math.max(0, Math.round((now - since) / 1000));
  return (
    <div className="shimmer absolute inset-0 grid place-items-center">
      <div className="text-center">
        <div className="mx-auto mb-2 size-6 animate-spin rounded-full border-2 border-lime border-t-transparent" />
        <p className="text-sm text-muted tabular-nums">Generating… {s}s</p>
      </div>
    </div>
  );
}
