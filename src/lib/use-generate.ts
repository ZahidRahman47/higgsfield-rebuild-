"use client";

import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { preloadImage } from "./generate";
import { useStudio, type Generation } from "./store";

/** Spends credits, records pending generations, and resolves each as its image arrives. */
export function useGenerate() {
  return useMutation({
    mutationFn: async (gens: Generation[]) => {
      const { spend, add } = useStudio.getState();
      const total = gens.reduce((n, g) => n + g.cost, 0);
      if (!spend(total)) throw new Error("Not enough credits");
      add(gens);
      await Promise.allSettled(gens.map(settle));
    },
  });
}

async function settle(g: Generation) {
  const { setStatus, refund } = useStudio.getState();
  try {
    await preloadImage(g.url);
    setStatus(g.id, "ready");
  } catch {
    setStatus(g.id, "failed");
    refund(g.cost);
  }
}

/** Generations left pending by a reload are deterministic URLs, so just resume them. */
export function useResumePending() {
  useEffect(() => {
    const resume = () =>
      useStudio.getState().generations.filter((g) => g.status === "pending").forEach(settle);
    if (useStudio.persist.hasHydrated()) resume();
    return useStudio.persist.onFinishHydration(resume);
  }, []);
}

export function newId() {
  return Math.random().toString(36).slice(2, 10);
}

/** Re-run a failed generation with the same parameters (charged again; refunded if it fails again). */
export function useRetry() {
  return useMutation({
    mutationFn: async (g: Generation) => {
      const s = useStudio.getState();
      if (!s.spend(g.cost)) throw new Error("Not enough credits");
      s.setStatus(g.id, "pending");
      await settle(g);
    },
  });
}
