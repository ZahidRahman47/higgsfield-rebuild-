"use client";

export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (src.startsWith("https://images.unsplash.com")) {
    return `${src}&w=${width}&q=${quality ?? 70}&auto=format&fit=max`;
  }
  // local files are pre-sized webp; the width param keeps srcset entries distinct
  return `${src}${src.includes("?") ? "&" : "?"}w=${width}`;
}
