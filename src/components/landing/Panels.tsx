import Link from "next/link";
import { Megaphone, Sparkles, User, Video as VideoIcon, MousePointer2, Wand2 } from "lucide-react";
import Photo from "./Photo";
import Logo from "@/components/Logo";
import { media } from "@/lib/media";

/* ---------- "prompt like a director" mascot panel ---------- */

function Blob({ eyes = "dots", className = "" }: { eyes?: "dots" | "glasses" | "shades"; className?: string }) {
  return (
    <svg viewBox="0 0 64 60" className={className} aria-hidden>
      <path d="M32 4c14 0 26 9 27 24 1 16-11 28-27 28S4 45 5 29C6 13 18 4 32 4Z" fill="#d9ff43" />
      <path d="M32 4c14 0 26 9 27 24 1 16-11 28-27 28" fill="none" stroke="#b8e01c" strokeWidth="3" />
      {eyes === "shades" ? (
        <path d="M14 26h36v6c0 4-4 6-8 6s-7-2-8-6h-4c-1 4-4 6-8 6s-8-2-8-6Z" fill="#0c0c0e" />
      ) : eyes === "glasses" ? (
        <>
          <circle cx="24" cy="29" r="7" fill="#fff" stroke="#0c0c0e" strokeWidth="3" />
          <circle cx="42" cy="29" r="7" fill="#fff" stroke="#0c0c0e" strokeWidth="3" />
          <circle cx="25" cy="30" r="2.5" fill="#0c0c0e" />
          <circle cx="43" cy="30" r="2.5" fill="#0c0c0e" />
        </>
      ) : (
        <>
          <ellipse cx="26" cy="30" rx="3.5" ry="5" fill="#0c0c0e" />
          <ellipse cx="40" cy="30" rx="3.5" ry="5" fill="#0c0c0e" />
        </>
      )}
    </svg>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-white/10 bg-[#26272c] px-3 py-1 text-[13px] text-white/90">{children}</span>;
}

export function DirectorPanel() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-line/60 bg-[radial-gradient(ellipse_at_top,#1c1d21,#101113_70%)] px-4 py-16 sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0d_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,transparent,black_60%)]" />
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <div className="absolute left-[22%] top-[22%] flex flex-col items-center gap-2"><Tag>Cinematic Director</Tag><div className="flex items-center gap-3"><Blob eyes="shades" className="size-14" /><MousePointer2 className="size-5 -rotate-90 text-white/70" /></div></div>
        <div className="absolute left-[29%] top-[62%] flex flex-col items-center gap-2"><div className="flex items-end gap-2"><Blob className="size-12 rotate-[-12deg]" /><MousePointer2 className="size-5 text-white/70" /></div><Tag>Character Creator</Tag></div>
        <div className="absolute right-[24%] top-[10%] flex flex-col items-center gap-2"><Tag>Motion Designer</Tag><div className="flex items-center gap-2"><MousePointer2 className="size-5 rotate-180 text-white/70" /><Blob eyes="glasses" className="size-14" /></div></div>
        <div className="absolute right-[26%] top-[56%] flex flex-col items-center gap-2"><div className="flex items-start gap-2"><MousePointer2 className="size-5 rotate-90 text-white/70" /><Blob className="size-14" /></div><Tag>Content Lead</Tag></div>
      </div>
      <div className="relative mx-auto max-w-2xl text-center">
        <h2 className="display text-[40px] sm:text-[64px]">
          Prompt like a <span className="inline-block translate-y-1"><Blob className="inline size-12 sm:size-16" /></span> director
          <br />with style presets
        </h2>
        <p className="mx-auto mt-4 max-w-md text-muted">Plan a shot, pick a look and camera move, and let the studio write the detailed prompt for you.</p>
        <Link href="/image" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-lime px-6 py-3 text-[17px] font-semibold text-black shadow-[0_4px_0_#8fae12] hover:bg-lime-deep">
          <Logo className="size-5" /> Start directing
        </Link>
      </div>
    </section>
  );
}

/* ---------- film festival ---------- */

const FILMS = [
  ["The Tortoise and the Hare", "serif"], ["BESA", "serif"], ["Count of Three", "spaced"],
  ["DETOUR", "heavy"], ["Ballast", "script"], ["Azul Cobalto", "serif"],
  ["Rest Face", "spaced"], ["Fallen Leaves", "spaced"], ["VARMINTS", "heavy"],
  ["The Kiss", "serif"], ["HARMONY", "tall"], ["The Thread", "spaced"],
] as const;

const filmFont: Record<string, string> = {
  serif: "font-serif text-xl tracking-wide",
  spaced: "font-serif text-sm uppercase tracking-[0.35em]",
  heavy: "display text-3xl text-[#ffd84a] drop-shadow-[0_2px_0_#000]",
  script: "font-serif text-2xl italic text-[#ff6a3d]",
  tall: "display text-5xl tracking-tight text-[#d4a640]",
};

export function FestivalPanel() {
  const posters = media("festival");
  return (
    <section className="grid overflow-hidden rounded-3xl border border-line/60 bg-black lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      <div className="relative flex min-h-[420px] flex-col items-center px-6 pt-12 text-center">
        <div className="flex items-center gap-2 text-[#e8c47a]"><Logo className="size-7 grayscale sepia" /><span className="text-2xl font-semibold">Higgsfield Rebuild</span></div>
        <p className="display mt-1 bg-gradient-to-b from-[#f6dfa4] to-[#a8813a] bg-clip-text text-5xl text-transparent sm:text-6xl">Global Film Festival</p>
        <h2 className="display mt-6 text-3xl sm:text-4xl">All submissions are live<br />the shortlist is next</h2>
        <p className="mt-2 text-muted">Watch all films while the jury makes its picks</p>
        <div className="relative mt-auto flex h-56 w-full items-end justify-center gap-4 [perspective:800px]">
          <div className="absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(ellipse_at_bottom,#e8c47a55,transparent_70%)]" />
          {[["h-32 w-24 -rotate-y-12", "#5b5f66"], ["h-48 w-32", "#d9b56a"], ["h-36 w-24 rotate-y-12", "#9a6a3c"]].map(([cls, c], i) => (
            <div key={i} className={`relative ${cls} rounded-md border border-white/20 shadow-2xl`} style={{ background: `linear-gradient(160deg, ${c}, #1a1a1a 85%)` }}>
              <Logo className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 opacity-80 grayscale" />
            </div>
          ))}
        </div>
      </div>
      <div className="relative grid grid-cols-2 gap-3 p-3 sm:grid-cols-3 sm:p-4">
        {FILMS.map(([title, font], i) => {
          const p = posters[i % posters.length];
          return (
            <Link key={title} href="/video" className="group relative aspect-[16/9] overflow-hidden rounded-xl border border-white/5">
              <Photo p={p} fill sizes="(max-width: 640px) 50vw, 20vw" className="brightness-[.65] transition-transform duration-700 group-hover:scale-105" />
              <span className={`absolute inset-0 grid place-items-center px-3 text-center leading-none ${filmFont[font]}`}>{title}</span>
            </Link>
          );
        })}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />
        <Link href="/video" className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-xl bg-gradient-to-b from-[#e8c47a] to-[#b38b45] px-5 py-2.5 font-semibold text-black shadow-[0_3px_0_#6e5323]">
          Explore all projects
        </Link>
      </div>
    </section>
  );
}

/* ---------- explore the inside of every project ---------- */

const PROJECTS = [
  ["If You Stop Loving Me", "heavy", "Mira K."], ["The Cully Hill Boys", "script", "Studio North"], ["Red Flag", "serif", "Lin Wei"], ["Kok Böru", "spaced", "Aru T."],
  ["ADILLADA", "heavy", "Dev P."], ["Oneiric", "spaced", "Sofia R."], ["Zephyr", "script", "Hana M."], ["Hell Grind", "tall", "Marco V."],
] as const;

export function ProjectsGrid() {
  const ph = media("projects");
  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PROJECTS.map(([title, font, by], i) => (
          <Link key={title} href="/video" className="group overflow-hidden rounded-2xl border border-line/60 bg-panel p-1.5">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
              <Photo p={ph[i % ph.length]} fill sizes="(max-width: 640px) 100vw, 25vw" className="brightness-75 transition-transform duration-700 group-hover:scale-105" />
              <span className={`absolute inset-0 grid place-items-center px-4 text-center leading-none ${filmFont[font]}`}>{title}</span>
            </div>
            <div className="flex items-center gap-2 px-1.5 py-2.5 text-sm">
              <Logo className="size-5 shrink-0" />
              <span className="min-w-0 flex-1 truncate">{title} <span className="text-muted">by {by}</span></span>
              <span className="rounded-md border border-line px-2 py-0.5 text-xs text-muted">Public</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ---------- superstudio (lime glow) ---------- */

export function SuperstudioPanel() {
  const ph = media("supercomputer");
  return (
    <section className="relative overflow-hidden rounded-3xl bg-black p-6 shadow-[inset_0_0_80px_#b8e01c,0_0_40px_#d9ff4355] ring-2 ring-lime sm:p-10">
      <div className="absolute inset-0 bg-[linear-gradient(#d9ff4314_1px,transparent_1px),linear-gradient(90deg,#d9ff4314_1px,transparent_1px)] [background-size:56px_56px] [transform:perspective(600px)_rotateX(35deg)_scale(1.6)] [transform-origin:center_70%]" />
      <div className="relative grid min-h-[380px] items-center gap-6 lg:grid-cols-[1fr_1.4fr_1fr]">
        <div className="hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur lg:block">
          <div className="mb-3 flex items-center justify-between text-sm"><span className="flex items-center gap-2"><User className="size-4" />UGC Creator</span><span className="text-muted">2/2</span></div>
          <div className="flex justify-center">
            {ph.slice(0, 3).map((p, i) => (
              <div key={p.id} className="relative -mx-2 h-32 w-24 overflow-hidden rounded-xl border-2 border-white/20 shadow-xl" style={{ transform: `rotate(${[-8, 0, 8][i]}deg) scale(${i === 1 ? 1.1 : 1})`, zIndex: i === 1 ? 2 : 1 }}>
                <Photo p={p} fill sizes="96px" />
              </div>
            ))}
          </div>
        </div>
        <div className="text-center">
          <div className="mx-auto mb-3 flex w-fit gap-1">{[Sparkles, Wand2, VideoIcon, Megaphone].map((I, i) => <span key={i} className="grid size-8 place-items-center rounded-lg bg-white/10"><I className="size-4 text-lime" /></span>)}</div>
          <h2 className="display text-[44px] text-lime sm:text-[64px]">Superstudio</h2>
          <p className="mt-2 text-white/80">One studio for your entire creative stack</p>
          <Link href="/image" className="mt-6 inline-block rounded-xl bg-white px-5 py-2.5 font-semibold text-black shadow-[0_3px_0_#9a9a9a]">Try Superstudio</Link>
        </div>
        <div className="relative hidden h-full lg:block">
          <span className="absolute left-0 top-4 flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm text-black"><MousePointer2 className="size-4 fill-white text-black" />Visualizing</span>
          <div className="absolute right-0 top-0 w-52 rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur">
            <p className="mb-2 flex items-center gap-2 text-sm"><Megaphone className="size-4" />Marketing</p>
            <div className="grid grid-cols-2 gap-1">{ph.slice(1, 3).map((p) => <div key={p.id} className="relative aspect-square overflow-hidden rounded-lg"><Photo p={p} fill sizes="100px" /></div>)}</div>
            <span className="absolute -bottom-3 -left-4 rounded-full bg-lime px-3 py-1 text-sm font-medium text-black">Analyzing hooks</span>
          </div>
          <div className="absolute bottom-0 left-6 w-56 rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur">
            <p className="mb-2 flex items-center gap-2 text-sm"><VideoIcon className="size-4" />Production <span className="ml-auto text-xs text-muted">11 shots</span></p>
            <div className="grid grid-cols-2 gap-1">{ph.slice(3, 5).map((p) => <div key={p.id} className="relative aspect-video overflow-hidden rounded-lg"><Photo p={p} fill sizes="110px" /></div>)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- one canvas banner ---------- */

export function CanvasBanner() {
  const [a, b] = media("canvas");
  return (
    <section className="relative grid overflow-hidden rounded-3xl bg-gradient-to-r from-[#11b5a4] via-[#0e6f9a] to-[#0b2a6b] p-6 sm:p-8 lg:grid-cols-[1fr_1.6fr]">
      <div className="relative z-10">
        <p className="text-sm font-semibold tracking-[0.25em]">NEW FEATURE</p>
        <h2 className="display mt-2 text-[40px] sm:text-[52px]">One canvas.<br />Every workflow.</h2>
        <p className="mt-3 max-w-xs text-white/80">Moodboard, chain styles and camera moves, and keep every take in one place.</p>
        <Link href="/assets" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 font-semibold text-black"><Sparkles className="size-4" />Open Assets</Link>
      </div>
      <div className="relative mt-8 hidden h-64 lg:mt-0 lg:block">
        <span className="absolute left-0 top-6 font-[cursive] text-5xl text-lime">ok</span>
        <span className="absolute left-14 top-24 rounded-xl bg-[#1fa463] px-3 py-1.5 text-sm">Mito</span>
        <div className="absolute bottom-[-30px] left-[-10px] w-52 rotate-[-6deg] rounded-lg bg-[#9fd0ff] p-3 font-[cursive] text-sm text-[#25415f] shadow-xl">Let&apos;s create an engaging video for our brand, @Mito please upload a product image</div>
        <div className="absolute left-[30%] top-2 h-[110%] w-56 overflow-hidden rounded-3xl border-[6px] border-[#2ec98f]/70 shadow-2xl"><Photo p={a} fill sizes="224px" /></div>
        <span className="absolute left-[60%] top-14 z-10 rounded-xl bg-[#1fa463] px-3 py-1.5 text-sm"><span className="block text-xs text-white/70">Gloria</span>That&apos;s cool!</span>
        <div className="absolute right-0 top-4 h-44 w-64 overflow-hidden rounded-3xl border-[6px] border-[#2ec98f]/70 shadow-2xl"><Photo p={b} fill sizes="256px" /></div>
      </div>
    </section>
  );
}

/* ---------- different scenes, same star ---------- */

export function PhotodumpBanner() {
  const ph = media("photodump");
  return (
    <section className="relative flex min-h-64 items-center overflow-hidden rounded-3xl bg-gradient-to-r from-[#a9b2c0] via-[#7a8494] to-[#3c4350] p-6 sm:p-8">
      <div className="relative z-10 max-w-sm">
        <span className="inline-block -skew-x-12 rounded bg-lime px-2.5 py-1 text-sm font-bold italic text-black">PHOTODUMP</span>
        <h2 className="display mt-3 text-[38px] sm:text-[44px]">Different scenes<br />same star</h2>
        <p className="mt-2 text-white/85">Build your character. One click does the rest.</p>
        <Link href="/image?style=fashion" className="mt-5 inline-block rounded-xl bg-white px-5 py-2.5 font-semibold text-black">Try Photodump</Link>
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[65%] md:block">
        {ph.slice(0, 6).map((p, i) => (
          <div
            key={p.id}
            className="absolute top-1/2 h-64 w-48 overflow-hidden rounded-3xl border border-white/30 shadow-2xl"
            style={{ left: `${4 + i * 15}%`, transform: `translateY(-${44 + (i % 2) * 12}%) rotate(${-18 + i * 3}deg)`, zIndex: i === 2 ? 5 : i }}
          >
            <Photo p={p} fill sizes="192px" />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- explore more features ---------- */

const CHIPS = [
  ["Create Image", "/image"], ["Create Video", "/video"], ["Cinematic", "/image?style=cinematic"], ["Photoreal", "/image?style=photoreal"],
  ["Product Shots", "/image?style=product"], ["Fashion Editorial", "/image?style=fashion"], ["Anime", "/image?style=anime"], ["3D Render", "/image?style=3d"],
  ["Dolly In", "/video?motion=dolly-in"], ["Dolly Out", "/video?motion=dolly-out"], ["Pan Left", "/video?motion=pan-left"], ["Pan Right", "/video?motion=pan-right"],
  ["Crane Up", "/video?motion=rise"], ["Arc Shot", "/video?motion=orbit"], ["Handheld", "/video?motion=handheld"], ["Crash Zoom", "/video?motion=crash-zoom"],
  ["Prompt Enhance", "/image"], ["Batch of 4", "/image"], ["Aspect Ratios", "/image"], ["Assets Library", "/assets"], ["Community", "/#community"],
] as const;

export function FeatureChips() {
  return (
    <section className="py-12 text-center">
      <h2 className="display text-[36px] sm:text-[48px]">Explore more AI features</h2>
      <div className="mx-auto mt-6 flex max-w-5xl flex-wrap justify-center gap-2">
        {CHIPS.map(([l, h]) => (
          <Link key={l} href={h} className="rounded-lg bg-card px-3 py-1.5 text-[15px] text-muted hover:bg-card-hover hover:text-white">{l}</Link>
        ))}
      </div>
    </section>
  );
}
