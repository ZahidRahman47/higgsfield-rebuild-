"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import clsx from "clsx";
import GenTile from "@/components/create/GenTile";
import Lightbox from "@/components/Lightbox";
import { useStudio, type Generation } from "@/lib/store";
import { useRetry } from "@/lib/use-generate";

const TABS = [
  { id: "all", label: "All" },
  { id: "image", label: "Images" },
  { id: "video", label: "Videos" },
] as const;

export default function AssetsView() {
  const params = useSearchParams();
  const [tab, setTab] = useState<string>(params.get("kind") ?? "all");
  const [open, setOpen] = useState<Generation | null>(null);
  const all = useStudio((s) => s.generations);
  const remove = useStudio((s) => s.remove);
  const retry = useRetry();

  const list = useMemo(() => (tab === "all" ? all : all.filter((g) => g.kind === tab)), [all, tab]);
  const counts = useMemo(() => ({ all: all.length, image: all.filter((g) => g.kind === "image").length, video: all.filter((g) => g.kind === "video").length }), [all]);
  const onOpen = useCallback((g: Generation) => setOpen(g), []);
  const onRetry = useCallback((g: Generation) => retry.mutate(g), [retry]);

  return (
    <main className="mx-auto max-w-[1600px] px-4 pb-20 pt-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-4xl">Assets</h1>
          <p className="text-muted">Everything you generate is kept here, in this browser.</p>
        </div>
        <div className="flex gap-1 rounded-xl border border-line bg-panel p-1">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={clsx("rounded-lg px-4 py-1.5 text-sm", tab === t.id ? "bg-card-hover text-white" : "text-muted hover:text-white")}>
              {t.label} <span className="text-dim" suppressHydrationWarning>{counts[t.id]}</span>
            </button>
          ))}
        </div>
      </div>
      {list.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-line py-24 text-center">
          <p className="display text-2xl">Nothing here yet</p>
          <p className="mb-5 mt-1 text-muted">Your first generation is free. You have credits waiting.</p>
          <div className="flex gap-2">
            <Link href="/image" className="rounded-xl bg-lime px-5 py-2.5 font-semibold text-black">Create image</Link>
            <Link href="/video" className="rounded-xl border border-line bg-card px-5 py-2.5">Create video</Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {list.map((g) => <GenTile key={g.id} g={g} onOpen={onOpen} onRetry={onRetry} />)}
        </div>
      )}
      {open && <Lightbox item={{ ...open, src: open.url }} onClose={() => setOpen(null)} onDelete={() => { remove([open.id]); setOpen(null); }} />}
    </main>
  );
}
