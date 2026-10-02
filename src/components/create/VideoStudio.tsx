"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Clock, Info, Pencil, RectangleHorizontal, Sparkles } from "lucide-react";
import clsx from "clsx";
import Popover from "@/components/Popover";
import Lightbox from "@/components/Lightbox";
import GenTile from "./GenTile";
import StylePicker from "./StylePicker";
import { useStudio, type Generation } from "@/lib/store";
import { useGenerate, useRetry, newId } from "@/lib/use-generate";
import { MODEL_LABEL, VIDEO_COST, imageUrl, randomSeed, styleById } from "@/lib/generate";
import { MOTIONS, motionById } from "@/lib/motion";
import { MEDIA } from "@/lib/media";

const FRAMES = [
  { id: "16:9", w: 1280, h: 720 },
  { id: "9:16", w: 720, h: 1280 },
  { id: "1:1", w: 896, h: 896 },
] as const;

export default function VideoStudio() {
  const params = useSearchParams();
  const [prompt, setPrompt] = useState(params.get("prompt") ?? "");
  const [style, setStyle] = useState(styleById(params.get("style") ?? "cinematic").id as string);
  const [motion, setMotion] = useState<string>(motionById(params.get("motion") ?? undefined).id);
  const [frame, setFrame] = useState<(typeof FRAMES)[number]["id"]>("16:9");
  const [open, setOpen] = useState<Generation | null>(null);

  const credits = useStudio((s) => s.credits);
  const all = useStudio((s) => s.generations);
  const remove = useStudio((s) => s.remove);
  const generate = useGenerate();
  const retry = useRetry();
  const videos = useMemo(() => all.filter((g) => g.kind === "video"), [all]);

  const m = motionById(motion);
  const short = credits < VIDEO_COST;
  const canGo = prompt.trim().length > 0 && !short;

  const submit = () => {
    if (!canGo) return;
    const f = FRAMES.find((x) => x.id === frame)!;
    const seed = randomSeed();
    generate.mutate([{
      id: newId(), batchId: newId(), kind: "video", prompt: prompt.trim(), style, aspect: frame, w: f.w, h: f.h, seed,
      enhance: true, motion, url: imageUrl({ prompt, style, w: f.w, h: f.h, seed, enhance: true }),
      cost: VIDEO_COST, status: "pending", createdAt: Date.now(),
    }]);
  };

  const onOpen = useCallback((g: Generation) => setOpen(g), []);
  const onRetry = useCallback((g: Generation) => retry.mutate(g), [retry]);

  return (
    <main className="mx-auto grid max-w-[1600px] gap-4 p-4 lg:grid-cols-[380px_minmax(0,1fr)]">
      <aside className="flex flex-col gap-3 rounded-2xl border border-line/70 bg-panel p-3 lg:sticky lg:top-24 lg:self-start">
        <div className="flex gap-4 border-b border-line px-1">
          <span className="border-b-2 border-white pb-2 text-[15px]">Create Video</span>
          <span className="pb-2 text-[15px] text-dim" title="Coming later">Edit Video</span>
        </div>

        <Popover
          side="bottom"
          className="grid w-[min(356px,calc(100vw-56px))] grid-cols-2 gap-1"
          trigger={() => (
            <div className="relative h-36 cursor-pointer overflow-hidden rounded-xl">
              <Image src={MEDIA.hero[0].src} alt="" fill sizes="380px" priority className="object-cover motion-play" style={{ animation: m.anim }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <span className="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 text-sm backdrop-blur"><Pencil className="size-3.5" />Change</span>
              <div className="absolute bottom-3 left-3">
                <p className="display text-2xl text-lime">{m.label}</p>
                <p className="text-sm text-white/80">{m.sub}</p>
              </div>
            </div>
          )}
        >
          {(close) => MOTIONS.map((x) => (
            <button key={x.id} onClick={() => { setMotion(x.id); close(); }}
              className={clsx("rounded-xl border p-3 text-left hover:bg-card", x.id === motion ? "border-lime/60 bg-card" : "border-transparent")}>
              <span className="text-xl">{x.glyph}</span>
              <span className="mt-1 block text-sm">{x.label}</span>
              <span className="block text-xs text-muted">{x.sub}</span>
            </button>
          ))}
        </Popover>

        <div className="rounded-xl bg-card p-3">
          <p className="mb-1 text-sm text-muted">Prompt</p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(); }}
            rows={4}
            maxLength={1000}
            placeholder="Describe the shot, e.g. “a lighthouse in a violent storm, waves crashing”"
            className="w-full resize-none bg-transparent text-[15px] outline-none placeholder:text-dim"
          />
          <StylePicker value={style} onChange={setStyle} side="bottom" />
        </div>

        <div className="flex items-center justify-between rounded-xl bg-card px-3 py-2.5">
          <div>
            <p className="text-xs text-muted">Model</p>
            <p className="text-[15px]">Motion Preview</p>
          </div>
          <span className="text-xs text-muted">{MODEL_LABEL}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 rounded-xl bg-card px-3 py-2.5 text-sm"><Clock className="size-4" />5s loop</div>
          <Popover
            side="bottom"
            align="right"
            trigger={() => <div className="flex cursor-pointer items-center gap-2 rounded-xl bg-card px-3 py-2.5 text-sm"><RectangleHorizontal className="size-4" />{frame}</div>}
          >
            {(close) => FRAMES.map((f) => (
              <button key={f.id} onClick={() => { setFrame(f.id); close(); }} className={clsx("block w-24 rounded-lg px-3 py-2 text-left text-sm hover:bg-card", f.id === frame && "text-lime")}>{f.id}</button>
            ))}
          </Popover>
        </div>

        <button
          onClick={submit}
          disabled={!canGo}
          className="flex items-center justify-center gap-2 rounded-xl bg-lime py-3.5 font-semibold text-black hover:bg-lime-deep disabled:cursor-not-allowed disabled:opacity-40"
        >
          Generate <Sparkles className="size-4" /> {VIDEO_COST}
        </button>
        <p className={clsx("text-center text-xs", short ? "text-pink" : "text-muted")} suppressHydrationWarning>
          {short ? `Need ${VIDEO_COST}, you have ${credits}. Refills tomorrow` : `${credits} credits left`}
        </p>
        <p className="flex gap-2 rounded-xl border border-line/70 p-3 text-xs text-muted">
          <Info className="size-4 shrink-0" />
          Free tier: an AI keyframe animated with a real camera move. Full video models plug into the same panel.
        </p>
      </aside>

      <section className="min-h-[60vh] rounded-2xl border border-line/70 bg-panel p-4 sm:p-6">
        {videos.length === 0 ? (
          <HowItWorks />
        ) : (
          <>
            <h2 className="mb-4 text-sm text-muted">History</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {videos.map((g) => <GenTile key={g.id} g={g} onOpen={onOpen} onRetry={onRetry} />)}
            </div>
          </>
        )}
      </section>

      {open && <Lightbox item={{ ...open, src: open.url }} onClose={() => setOpen(null)} onDelete={() => { remove([open.id]); setOpen(null); }} />}
    </main>
  );
}

function HowItWorks() {
  const steps = [
    { id: "1", p: MEDIA.cinematic[3], title: "Describe the shot", sub: "Write what the camera sees. A style sets the look." },
    { id: "2", p: MEDIA.community[0], title: "Choose a camera move", sub: "Dolly, crane, arc, handheld, crash zoom and more.", motion: "pan-right" },
    { id: "3", p: MEDIA.soulcinema[1], title: "Get your motion shot", sub: "Click Generate. It plays in History, ready to download.", motion: "dolly-in" },
  ];
  return (
    <div className="py-6 sm:py-12">
      <h1 className="display text-4xl sm:text-5xl">Make videos in one click</h1>
      <p className="mt-2 text-muted">8 camera presets for movement and framing, or describe anything you like.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <div key={s.id}>
            <div className="relative aspect-video overflow-hidden rounded-xl bg-card">
              <Image src={s.p.src} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover motion-play" style={s.motion ? { animation: motionById(s.motion).anim } : undefined} />
              <span className="absolute left-2 top-2 grid size-7 place-items-center rounded-full bg-lime text-sm font-bold text-black">{i + 1}</span>
            </div>
            <h3 className="display mt-3 text-xl">{s.title}</h3>
            <p className="text-sm text-muted">{s.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
