"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Gem, Minus, Plus, RectangleHorizontal, SlidersHorizontal, Sparkles, Wand2 } from "lucide-react";
import clsx from "clsx";
import Popover, { Chip } from "@/components/Popover";
import Lightbox from "@/components/Lightbox";
import GenTile from "./GenTile";
import StylePicker from "./StylePicker";
import { useStudio, type Generation } from "@/lib/store";
import { useGenerate, useRetry, newId } from "@/lib/use-generate";
import {
  ASPECTS, QUALITIES, dimensions, imageCost, imageUrl, randomSeed, styleById,
  type AspectId, type QualityId,
} from "@/lib/generate";
import { MEDIA } from "@/lib/media";

export default function ImageStudio() {
  const params = useSearchParams();
  const [prompt, setPrompt] = useState(params.get("prompt") ?? "");
  const [style, setStyle] = useState(styleById(params.get("style") ?? "cinematic").id as string);
  const [aspect, setAspect] = useState<AspectId>("3:4");
  const [quality, setQuality] = useState<QualityId>("high");
  const [count, setCount] = useState(4);
  const [enhance, setEnhance] = useState(true);
  const [zoom, setZoom] = useState(3);
  const [open, setOpen] = useState<Generation | null>(null);

  const credits = useStudio((s) => s.credits);
  const all = useStudio((s) => s.generations);
  const remove = useStudio((s) => s.remove);
  const generate = useGenerate();
  const retry = useRetry();

  const images = useMemo(() => all.filter((g) => g.kind === "image"), [all]);
  const batches = useMemo(() => {
    const map = new Map<string, Generation[]>();
    for (const g of images) map.set(g.batchId, [...(map.get(g.batchId) ?? []), g]);
    return [...map.values()];
  }, [images]);

  const cost = imageCost(quality, count);
  const short = credits < cost;
  const canGo = prompt.trim().length > 0 && !short;

  const submit = () => {
    if (!canGo) return;
    const { w, h } = dimensions(aspect, quality);
    const batchId = newId();
    const per = cost / count;
    const gens: Generation[] = Array.from({ length: count }, () => {
      const seed = randomSeed();
      return {
        id: newId(), batchId, kind: "image", prompt: prompt.trim(), style, aspect, w, h, seed, enhance,
        url: imageUrl({ prompt, style, w, h, seed, enhance }), cost: per, status: "pending", createdAt: Date.now(),
      };
    });
    generate.mutate(gens);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // stable callbacks so memoized tiles don't re-render on every keystroke in the prompt box
  const onOpen = useCallback((g: Generation) => setOpen(g), []);
  const onRetry = useCallback((g: Generation) => retry.mutate(g), [retry]);

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-96px)] max-w-[1600px] flex-col px-4">
      {batches.length > 0 && (
        <div className="flex items-center justify-end gap-3 py-3">
          <SlidersHorizontal className="size-4 text-muted" />
          <input
            type="range" min={2} max={6} value={zoom} onChange={(e) => setZoom(+e.target.value)}
            aria-label="Grid size" className="w-32 accent-lime"
            style={{ direction: "rtl" }}
          />
        </div>
      )}

      <div className="flex-1 pb-56">
        {batches.length === 0 ? (
          <EmptyHero onPick={setPrompt} />
        ) : (
          <div className="space-y-8">
            {batches.map((b) => (
              <section key={b[0].batchId}>
                <div className="mb-2 flex items-center gap-2 text-sm">
                  <span className="rounded-md bg-card px-2 py-0.5 text-xs text-muted">{styleById(b[0].style).label}</span>
                  <span className="rounded-md bg-card px-2 py-0.5 text-xs text-muted">{b[0].aspect}</span>
                  <button className="min-w-0 truncate text-left text-muted hover:text-white" title="Use this prompt" onClick={() => { setPrompt(b[0].prompt); setStyle(b[0].style); }}>
                    {b[0].prompt}
                  </button>
                </div>
                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(zoom, b.length > 1 ? zoom : 2)}, minmax(0, 1fr))` }}>
                  {b.map((g) => <GenTile key={g.id} g={g} onOpen={onOpen} onRetry={onRetry} />)}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 bg-gradient-to-t from-bg via-bg/95 to-transparent px-3 pb-3 pt-8 sm:pb-5">
        <div className="mx-auto max-w-5xl rounded-2xl border border-line bg-panel p-3 shadow-2xl sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <div className="min-w-0 flex-1">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(); }}
                rows={2}
                maxLength={1000}
                placeholder="Describe the scene you imagine"
                className="w-full resize-none bg-transparent px-1 text-[15px] outline-none placeholder:text-dim"
              />
              <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto sm:flex-wrap sm:overflow-visible">
                <StylePicker value={style} onChange={setStyle} />
                <Popover trigger={(o) => <Chip active={o}><RectangleHorizontal className="size-4" />{aspect}</Chip>}>
                  {(close) => (
                    <div className="flex gap-1">
                      {ASPECTS.map((a) => (
                        <button key={a.id} onClick={() => { setAspect(a.id); close(); }}
                          className={clsx("flex w-16 flex-col items-center gap-2 rounded-xl p-2 text-xs hover:bg-card", a.id === aspect && "bg-card text-lime")}>
                          <span className="grid h-8 place-items-center">
                            <span className="block rounded-sm border-2 border-current" style={{ width: (a.w / Math.max(a.w, a.h)) * 26, height: (a.h / Math.max(a.w, a.h)) * 26 }} />
                          </span>
                          {a.id}
                        </button>
                      ))}
                    </div>
                  )}
                </Popover>
                <Popover className="w-56" trigger={(o) => <Chip active={o}><Gem className="size-4" />{QUALITIES.find((q) => q.id === quality)!.label}</Chip>}>
                  {(close) => QUALITIES.map((q) => (
                    <button key={q.id} onClick={() => { setQuality(q.id); close(); }}
                      className={clsx("flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm hover:bg-card", q.id === quality && "text-lime")}>
                      {q.label}<span className="text-muted">{q.cost} credit{q.cost > 1 ? "s" : ""} / image</span>
                    </button>
                  ))}
                </Popover>
                <button onClick={() => setEnhance((e) => !e)} title="Let the model expand your prompt with detail">
                  <Chip active={enhance} className={clsx(enhance && "!border-lime/50 text-lime")}><Wand2 className="size-4" />Enhance {enhance ? "on" : "off"}</Chip>
                </button>
                <span className="flex h-10 items-center gap-1 rounded-xl border border-line bg-card px-1 text-sm">
                  <button aria-label="Fewer" disabled={count <= 1} onClick={() => setCount((c) => c - 1)} className="p-2 text-muted hover:text-white disabled:opacity-30"><Minus className="size-3.5" /></button>
                  <span className="w-7 text-center tabular-nums">{count}/4</span>
                  <button aria-label="More" disabled={count >= 4} onClick={() => setCount((c) => c + 1)} className="p-2 text-muted hover:text-white disabled:opacity-30"><Plus className="size-3.5" /></button>
                </span>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-1 sm:w-40">
              <button
                onClick={submit}
                disabled={!canGo}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-lime px-6 py-3 font-semibold sm:flex-col sm:gap-0 text-black transition-colors hover:bg-lime-deep disabled:cursor-not-allowed disabled:opacity-40"
              >
                Generate
                <span className="flex items-center gap-1 text-sm font-medium"><Sparkles className="size-3.5" />{cost}</span>
              </button>
              <p className={clsx("text-center text-xs", short ? "text-pink" : "text-muted")} suppressHydrationWarning>
                {short ? `Need ${cost}, you have ${credits}. Refills tomorrow` : `${credits} credits left`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <Lightbox
          item={{ ...open, src: open.url }}
          onClose={() => setOpen(null)}
          onDelete={() => { remove([open.id]); setOpen(null); }}
        />
      )}
    </main>
  );
}

function EmptyHero({ onPick }: { onPick: (p: string) => void }) {
  const fan = [MEDIA.soulcinema[0], MEDIA.soulcinema[3], MEDIA.cinematic[1], MEDIA.soul[1]];
  const ideas = [MEDIA.vfx[0], MEDIA.cinematic[2], MEDIA.marketing[1]];
  return (
    <div className="flex flex-col items-center pt-[8vh] text-center">
      <div className="mb-8 flex">
        {fan.map((s, i) => (
          <Image
            key={s.id} src={s.src} alt="" width={144} height={176} priority
            className="-mx-2 h-36 w-28 rounded-xl border-2 border-white/15 object-cover shadow-2xl sm:h-44 sm:w-36"
            style={{ backgroundColor: s.color, transform: `rotate(${[-8, -3, 3, 8][i]}deg) translateY(${[8, 0, 0, 8][i]}px)` }}
          />
        ))}
      </div>
      <h1 className="display text-4xl sm:text-6xl">
        Start creating with
        <br />
        <span className="text-lime">Higgsfield Rebuild</span>
      </h1>
      <p className="mt-3 max-w-lg text-muted">Describe a scene, character, mood, or style and watch it come to life.</p>
      <div className="mt-6 flex max-w-3xl flex-wrap justify-center gap-2">
        {ideas.map((s) => (
          <button key={s.id} onClick={() => onPick(s.alt)} className="rounded-full border border-line bg-card px-4 py-2 text-sm text-muted hover:text-white">
            Try: {s.alt}
          </button>
        ))}
      </div>
    </div>
  );
}
