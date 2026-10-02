import data from "@/data/media.json";

export type Photo = { id: string; src: string; w: number; h: number; color: string; alt: string; author: string; link: string };
export type Section = keyof typeof data;

export const MEDIA = data as Record<Section, Photo[]>;
export const media = (s: Section) => MEDIA[s];
