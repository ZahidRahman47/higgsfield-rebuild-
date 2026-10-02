import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clapperboard, Image as ImageIcon, Folder, Palette, Sparkles, Wand2 } from "lucide-react";
import Feed from "@/components/explore/Feed";
import { SHOWCASE } from "@/lib/showcase";
import { DAILY_CREDITS } from "@/lib/generate";

const pick = (id: string) => SHOWCASE.find((s) => s.id === id) ?? SHOWCASE[0];

const HERO = [
  { id: "jazz", title: "Create Image", sub: "Describe a scene, pick a style, get four takes in seconds", href: "/image" },
  { id: "samurai", title: "Motion Shots", sub: "Turn any prompt into a camera move: dolly, crane, crash zoom", href: "/video" },
  { id: "perfume", title: "Product Style", sub: "Studio-grade product photos from one sentence", href: "/image?style=product" },
  { id: "anime-city", title: "Anime Style", sub: "Vibrant illustrated worlds, ready to remix", href: "/image?style=anime" },
];

const TOOLS = [
  { icon: ImageIcon, title: "Create Image", sub: "Text to image, 4 at a time", tag: "Image", href: "/image" },
  { icon: Clapperboard, title: "Create Video", sub: "8 camera motion presets", tag: "Video", href: "/video" },
  { icon: Palette, title: "Cinematic", sub: "Film stills with anamorphic look", tag: "Style", href: "/image?style=cinematic" },
  { icon: Wand2, title: "Prompt Enhance", sub: "Rough idea in, detailed prompt out", tag: "Tool", href: "/image" },
  { icon: Sparkles, title: "Fashion Editorial", sub: "Bold styling, magazine light", tag: "Style", href: "/image?style=fashion" },
  { icon: Folder, title: "Assets", sub: "Everything you've made, in one place", tag: "Library", href: "/assets" },
];

export default function Explore() {
  return (
    <main className="mx-auto max-w-[1600px] space-y-10 px-4 pb-20 pt-5">
      <section className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4">
        {HERO.map((h, i) => {
          const img = pick(h.id);
          return (
            <Link key={h.id} href={h.href} className="group w-[82vw] shrink-0 snap-start sm:w-[46vw] lg:w-[31vw]">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-card">
                <Image
                  src={img.src}
                  alt=""
                  fill
                  priority={i < 3}
                  placeholder="blur"
                  blurDataURL={img.blur}
                  sizes="(max-width: 640px) 82vw, (max-width: 1024px) 46vw, 31vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="display mt-3 text-xl group-hover:text-lime">{h.title}</h3>
              <p className="text-sm text-muted">{h.sub}</p>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,2fr)]">
        <div className="relative flex min-h-64 flex-col justify-end overflow-hidden rounded-2xl p-6 sm:p-8">
          <Image src={pick("desert-runner").src} alt="" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/10" />
          <div className="relative">
            <h1 className="display text-4xl sm:text-5xl">
              {DAILY_CREDITS} free credits
              <br />
              <span className="text-lime">every single day</span>
            </h1>
            <p className="mt-3 max-w-md text-white/80">
              No sign-up wall, no countdown timer. Make something first, then decide if you like it.
            </p>
            <Link href="/image" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-lime px-6 py-3 font-semibold text-black hover:bg-lime-deep">
              Start creating <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {TOOLS.map((t) => (
            <Link key={t.title} href={t.href} className="flex flex-col rounded-2xl border border-line/70 bg-panel p-4 transition-colors hover:bg-card sm:p-5">
              <div className="flex items-start justify-between">
                <t.icon className="size-5 text-white" />
                <span className="rounded-md border border-line px-2 py-0.5 text-xs text-muted">{t.tag}</span>
              </div>
              <h3 className="mt-6 font-semibold sm:mt-8">{t.title}</h3>
              <p className="text-sm text-muted">{t.sub}</p>
            </Link>
          ))}
        </div>
      </section>

      <Feed />
    </main>
  );
}
