// Every image is a deterministic URL of (prompt, style, size, seed) served by
// /api/image, so results are CDN-cacheable and can be re-created or shared
// from their parameters alone.

import { MEDIA } from "./media";

export type Kind = "image" | "video";

export const STYLES = [
  { id: "none", label: "General", suffix: "", thumb: MEDIA.hero[2].src },
  { id: "cinematic", label: "Cinematic", suffix: "cinematic film still, anamorphic lens, dramatic lighting, film grain", thumb: MEDIA.soulcinema[0].src },
  { id: "photoreal", label: "Photoreal", suffix: "ultra realistic photograph, natural light, 85mm, high detail", thumb: MEDIA.cinematic[0].src },
  { id: "product", label: "Product", suffix: "studio product photography, clean background, soft shadows, commercial", thumb: MEDIA.marketing[0].src },
  { id: "fashion", label: "Fashion", suffix: "high fashion editorial photo, vogue, bold styling", thumb: MEDIA.soul[0].src },
  { id: "anime", label: "Anime", suffix: "anime illustration, vibrant colors, detailed background", thumb: "/showcase/anime-city.webp" },
  { id: "3d", label: "3D Render", suffix: "3d render, pixar style, soft global illumination", thumb: "/showcase/fox.webp" },
] as const;
export type StyleId = (typeof STYLES)[number]["id"];

export const ASPECTS = [
  { id: "3:4", w: 768, h: 1024 },
  { id: "1:1", w: 896, h: 896 },
  { id: "4:3", w: 1024, h: 768 },
  { id: "9:16", w: 720, h: 1280 },
  { id: "16:9", w: 1280, h: 720 },
] as const;
export type AspectId = (typeof ASPECTS)[number]["id"];

export const QUALITIES = [
  { id: "standard", label: "Standard", scale: 0.75, cost: 1 },
  { id: "high", label: "High", scale: 1, cost: 2 },
] as const;
export type QualityId = (typeof QUALITIES)[number]["id"];

export const VIDEO_COST = 10;
export const DAILY_CREDITS = 100;
export const MODEL_LABEL = "Sana · Pollinations";

export function styleById(id: string) {
  return STYLES.find((s) => s.id === id) ?? STYLES[0];
}

export function dimensions(aspect: AspectId, quality: QualityId) {
  const a = ASPECTS.find((x) => x.id === aspect) ?? ASPECTS[0];
  const q = QUALITIES.find((x) => x.id === quality) ?? QUALITIES[1];
  // round to multiples of 16, which the model prefers
  const r = (n: number) => Math.round((n * q.scale) / 16) * 16;
  return { w: r(a.w), h: r(a.h) };
}

export function imageCost(quality: QualityId, count: number) {
  return (QUALITIES.find((q) => q.id === quality)?.cost ?? 2) * count;
}

export function imageUrl(p: { prompt: string; style: string; w: number; h: number; seed: number; enhance?: boolean }) {
  const qs = new URLSearchParams({
    prompt: p.prompt.trim(),
    style: p.style,
    w: String(p.w),
    h: String(p.h),
    seed: String(p.seed),
  });
  if (p.enhance) qs.set("enhance", "1");
  return `/api/image?${qs}`;
}

export function randomSeed() {
  return Math.floor(Math.random() * 2_000_000_000);
}

// The free provider sheds bursts, so images load through a small queue.
const MAX_PARALLEL = 2;
let active = 0;
const waiting: (() => void)[] = [];

async function slot<T>(fn: () => Promise<T>): Promise<T> {
  if (active >= MAX_PARALLEL) await new Promise<void>((r) => waiting.push(r));
  active++;
  try {
    return await fn();
  } finally {
    active--;
    waiting.shift()?.();
  }
}

function loadOnce(url: string) {
  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Image failed to load"));
    img.src = url;
  });
}

/** Resolves once the image is generated and in the browser cache. Retries rate-limit errors. */
export function preloadImage(url: string, retries = 1): Promise<void> {
  return slot(async () => {
    for (let i = 0; ; i++) {
      try {
        return await loadOnce(url);
      } catch (e) {
        if (i >= retries) throw e;
        await new Promise((r) => setTimeout(r, 2500 * (i + 1)));
      }
    }
  });
}
