import Link from "next/link";
import { Clapperboard, Image as ImageIcon, Folder, Palette, Wand2, Camera } from "lucide-react";
import HeroRow from "@/components/landing/HeroRow";
import Masonry from "@/components/landing/Masonry";
import Photo from "@/components/landing/Photo";
import { SectionHead } from "@/components/landing/SectionHead";
import {
  CanvasBanner, DirectorPanel, FeatureChips, FestivalPanel, PhotodumpBanner, ProjectsGrid, SuperstudioPanel,
} from "@/components/landing/Panels";
import { ViewAll } from "@/components/landing/SectionHead";
import { media, type Photo as P } from "@/lib/media";
import { DAILY_CREDITS } from "@/lib/generate";

const img = (style: string) => (p: P) => `/image?${new URLSearchParams({ prompt: p.alt, style })}`;
const vid = (motion: string) => (p: P) => `/video?${new URLSearchParams({ prompt: p.alt, style: "cinematic", motion })}`;

const TILES = [
  { icon: Clapperboard, title: "Create Video", badge: "TOP", sub: "8 camera moves from one prompt", tag: "Video", href: "/video" },
  { icon: ImageIcon, title: "Create Image", sub: "Four takes in seconds", tag: "Image", href: "/image" },
  { icon: Palette, title: "Style Presets", badge: "NEW", sub: "Cinematic, product, fashion and more", href: "/image?style=cinematic" },
  { icon: Wand2, title: "Prompt Enhance", sub: "Rough idea in, detailed prompt out", href: "/image" },
  { icon: Camera, title: "Motion Presets", sub: "Dolly, crane, arc, crash zoom", href: "/video?motion=crash-zoom" },
  { icon: Folder, title: "Assets", sub: "Everything you've made, in one place", href: "/assets" },
];

export default function Explore() {
  const hero = media("hero");
  const promo = media("promo")[0];
  return (
    <main className="mx-auto max-w-[1600px] space-y-14 px-4 pb-10 pt-5">
      <HeroRow
        items={[
          { p: hero[0], title: "Motion presets", sub: "Keep the scene, choose how the camera moves", href: "/video" },
          { p: hero[2], title: "Cinematic style", sub: "Film stills with an anamorphic, graded look", href: "/image?style=cinematic" },
          { p: hero[4], title: "Color grading presets", sub: "Photoreal, cinematic, fashion: one click each", href: "/image?style=photoreal", accent: true },
          { p: hero[6], title: "Fashion editorial", sub: "Magazine light and bold styling from a sentence", href: "/image?style=fashion" },
        ]}
      />

      <section className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className="relative flex min-h-60 flex-col justify-between overflow-hidden rounded-2xl p-6">
          <Photo p={promo} fill priority sizes="(max-width: 1024px) 100vw, 33vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
          <h1 className="display relative text-[32px] sm:text-[38px]">
            {DAILY_CREDITS} free credits
            <br />
            <span className="text-lime">every single day</span>
          </h1>
          <div className="relative">
            <p className="mb-4 max-w-sm text-white/85">No sign-up wall, no countdown. Generate first, decide later.</p>
            <Link href="/image" className="inline-block rounded-xl bg-lime px-14 py-3 text-[17px] font-semibold text-black shadow-[0_4px_0_#8fae12] hover:bg-lime-deep">
              Start creating free
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {TILES.map((t) => (
            <Link key={t.title} href={t.href} className="flex flex-col justify-between rounded-2xl border border-line/50 bg-[#1a1b1f] p-4 transition-colors hover:bg-card-hover sm:p-5">
              <div className="flex items-start justify-between">
                <t.icon className="size-5" />
                {t.tag && <span className="flex items-center gap-1 rounded-lg bg-white/5 px-2 py-1 text-sm text-white/80">{t.tag}</span>}
              </div>
              <div className="mt-8">
                <h3 className="flex items-center gap-2 font-semibold">
                  {t.title}
                  {t.badge && <span className={`-skew-x-12 rounded px-1.5 text-[11px] font-bold italic ${t.badge === "TOP" ? "bg-pink text-white" : "bg-lime text-black"}`}>{t.badge}</span>}
                </h3>
                <p className="mt-1 text-sm text-muted">{t.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <DirectorPanel />
      <FestivalPanel />

      <section id="vfx">
        <SectionHead title="Visual effects" sub="Big-budget looks, from explosions to surreal transformations." cta={{ label: "Start generating", href: "/image?style=cinematic" }} />
        <Masonry photos={media("vfx")} cols={5} view={{ label: "View all presets", href: "/image" }} to={img("cinematic")} />
      </section>

      <section className="rounded-3xl border border-line/60 bg-black p-4 sm:p-6">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-lime/30 bg-lime/10 px-3 py-1 text-sm text-lime">New preset</span>
        <div className="mb-5 mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="display text-[30px] text-lime sm:text-[38px]">Street restyle</h2>
            <p className="mt-1 max-w-xl text-muted">Keep the moment, change the world: put any subject into a new scene with a camera move that sells it.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/video?motion=handheld" className="rounded-xl bg-lime px-4 py-2.5 font-semibold text-black shadow-[0_3px_0_#8fae12]">Start generating</Link>
            <Link href="/video" className="rounded-xl bg-white px-4 py-2.5 font-semibold text-black">Learn more</Link>
          </div>
        </div>
        <Masonry photos={media("restyle")} cols={5} height="h-[680px]" view={{ label: "View all presets", href: "/video" }} to={vid("handheld")} />
      </section>

      <section>
        <SectionHead title="Cinematic video" sub="Prompt to motion shot with eight camera presets." />
        <Masonry photos={media("cinematic")} view={{ label: "View all cinematic shots", href: "/video" }} to={vid("dolly-in")} />
      </section>

      <section id="projects" className="relative">
        <SectionHead title="Explore the inside of every project" sub="See the prompts and settings behind each one." />
        <ProjectsGrid />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
        <ViewAll label="Explore community" href="/#community" />
      </section>

      <SuperstudioPanel />

      <section>
        <SectionHead title="Posters & typography" sub="Bold layouts and product packaging, ready for print." />
        <Masonry photos={media("textimg")} view={{ label: "View all posters", href: "/image?style=product" }} to={img("product")} />
      </section>

      <CanvasBanner />

      <section>
        <SectionHead title="Product & ads" sub="See what creators and brands are making with product styles." />
        <Masonry photos={media("marketing")} view={{ label: "View all product shots", href: "/image?style=product" }} to={img("product")} />
      </section>

      <section id="community">
        <SectionHead title="Community motion shots" sub="Browse cinematic generations from the community." />
        <Masonry photos={media("community")} mode="grid" height="h-[620px]" view={{ label: "View all motion shots", href: "/video" }} to={vid("pan-right")} />
      </section>

      <PhotodumpBanner />

      <section>
        <SectionHead title="Cinematic portraits" sub="Film-grade portraits with grain, mood and real light." />
        <Masonry photos={media("soulcinema")} mode="grid" height="h-[620px]" view={{ label: "View all portraits", href: "/image?style=cinematic" }} to={img("cinematic")} />
      </section>

      <section>
        <SectionHead title="Fashion & aesthetics" sub="A look built for fashion, aesthetics and creative expression." />
        <Masonry photos={media("soul")} view={{ label: "View all fashion", href: "/image?style=fashion" }} to={img("fashion")} />
      </section>

      <FeatureChips />
    </main>
  );
}
