import Image from "next/image";
import clsx from "clsx";
import type { Photo as P } from "@/lib/media";

/** An Unsplash photo: lazy, sized by the loader, dominant colour as its placeholder. */
export default function Photo({
  p, sizes, className, fill, priority,
}: { p: P; sizes: string; className?: string; fill?: boolean; priority?: boolean }) {
  return (
    <Image
      src={p.src}
      alt={p.alt}
      {...(fill ? { fill: true } : { width: p.w, height: p.h })}
      sizes={sizes}
      priority={priority}
      style={{ backgroundColor: p.color }}
      className={clsx("object-cover", !fill && "h-auto w-full", className)}
    />
  );
}
