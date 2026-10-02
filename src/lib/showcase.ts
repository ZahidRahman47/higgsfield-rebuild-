import data from "@/data/showcase.json";

export type ShowcaseItem = {
  id: string;
  prompt: string;
  style: string;
  w: number;
  h: number;
  seed: number;
  src: string;
  blur: string;
};

export const SHOWCASE = data as ShowcaseItem[];

/** Map a showcase label ("Cinematic") to a style id ("cinematic"). */
export const styleIdOf = (label: string) => (label === "3D" ? "3d" : label.toLowerCase());
