"use client";

import { useSyncExternalStore } from "react";

const BREAKS = [
  [1280, 5],
  [1024, 4],
  [640, 3],
] as const;

function current() {
  const w = window.innerWidth;
  return BREAKS.find(([min]) => w >= min)?.[1] ?? 2;
}

function subscribe(cb: () => void) {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
}

/** Masonry column count for the viewport; 4 on the server to match a typical desktop. */
export function useColumns() {
  return useSyncExternalStore(subscribe, current, () => 4);
}
