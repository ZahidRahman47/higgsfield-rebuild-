"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DAILY_CREDITS, type Kind } from "./generate";

export type GenStatus = "pending" | "ready" | "failed";

export type Generation = {
  id: string;
  batchId: string;
  kind: Kind;
  prompt: string;
  style: string;
  aspect: string;
  w: number;
  h: number;
  seed: number;
  enhance: boolean;
  url: string;
  motion?: string;
  cost: number;
  status: GenStatus;
  createdAt: number;
};

type State = {
  credits: number;
  refilledOn: string;
  generations: Generation[];
  bannerDismissed: boolean;
  spend: (n: number) => boolean;
  refund: (n: number) => void;
  refill: () => void;
  add: (g: Generation[]) => void;
  setStatus: (id: string, status: GenStatus) => void;
  remove: (ids: string[]) => void;
  dismissBanner: () => void;
  resetAll: () => void;
};

const today = () => new Date().toISOString().slice(0, 10);

export const useStudio = create<State>()(
  persist(
    (set, get) => ({
      credits: DAILY_CREDITS,
      refilledOn: today(),
      generations: [],
      bannerDismissed: false,
      spend: (n) => {
        if (get().credits < n) return false;
        set((s) => ({ credits: s.credits - n }));
        return true;
      },
      refund: (n) => set((s) => ({ credits: s.credits + n })),
      refill: () => {
        // free credits top back up to the daily amount once per day
        if (get().refilledOn !== today())
          set((s) => ({ refilledOn: today(), credits: Math.max(s.credits, DAILY_CREDITS) }));
      },
      add: (g) => set((s) => ({ generations: [...g, ...s.generations] })),
      setStatus: (id, status) =>
        set((s) => ({ generations: s.generations.map((g) => (g.id === id ? { ...g, status } : g)) })),
      remove: (ids) => set((s) => ({ generations: s.generations.filter((g) => !ids.includes(g.id)) })),
      dismissBanner: () => set({ bannerDismissed: true }),
      resetAll: () => set({ credits: DAILY_CREDITS, refilledOn: today(), generations: [], bannerDismissed: false }),
    }),
    // hydrate after mount (see Providers) so server and first client render match
    { name: "hf-rebuild", skipHydration: true, version: 1 },
  ),
);
