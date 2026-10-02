export const MOTIONS = [
  { id: "dolly-in", label: "Dolly In", sub: "Push slowly into the subject", glyph: "⤢", anim: "dolly-in 5s ease-in-out infinite alternate" },
  { id: "dolly-out", label: "Dolly Out", sub: "Pull back to reveal the scene", glyph: "⤡", anim: "dolly-out 5s ease-in-out infinite alternate" },
  { id: "pan-left", label: "Pan Left", sub: "Slide across the frame", glyph: "←", anim: "pan-left 5s ease-in-out infinite alternate" },
  { id: "pan-right", label: "Pan Right", sub: "Slide across the frame", glyph: "→", anim: "pan-right 5s ease-in-out infinite alternate" },
  { id: "rise", label: "Crane Up", sub: "Rise over the subject", glyph: "↑", anim: "rise 5s ease-in-out infinite alternate" },
  { id: "orbit", label: "Arc Shot", sub: "Curve around the subject", glyph: "↻", anim: "orbit 5s ease-in-out infinite alternate" },
  { id: "handheld", label: "Handheld", sub: "Documentary camera shake", glyph: "≈", anim: "handheld 3s ease-in-out infinite" },
  { id: "crash-zoom", label: "Crash Zoom", sub: "Slow build, sudden punch-in", glyph: "⊕", anim: "crash-zoom 3s cubic-bezier(.7,0,.9,.4) infinite" },
] as const;

export function motionById(id?: string) {
  return MOTIONS.find((m) => m.id === id) ?? MOTIONS[0];
}
