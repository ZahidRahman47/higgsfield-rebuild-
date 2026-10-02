"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronRight } from "lucide-react";
import Photo from "./Photo";
import type { Photo as P } from "@/lib/media";

export default function HeroRow({ items }: { items: { p: P; title: string; sub: string; href: string; accent?: boolean }[] }) {
  const row = useRef<HTMLDivElement>(null);
  return (
    <div className="relative">
      <div ref={row} className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4">
        {items.map((h, i) => (
          <Link key={h.title} href={h.href} className="group w-[82vw] shrink-0 snap-start sm:w-[46vw] lg:w-[31.5vw]">
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-card">
              <Photo p={h.p} fill priority={i < 3} sizes="(max-width: 640px) 82vw, (max-width: 1024px) 46vw, 32vw" className="transition-transform duration-700 group-hover:scale-105" />
            </div>
            <h3 className={`display mt-3 text-lg ${h.accent ? "text-lime" : ""}`}>{h.title}</h3>
            <p className="text-[15px] text-muted">{h.sub}</p>
          </Link>
        ))}
      </div>
      <button
        aria-label="Next"
        onClick={() => row.current?.scrollBy({ left: row.current.clientWidth * 0.6, behavior: "smooth" })}
        className="absolute right-2 top-[28%] hidden size-11 place-items-center rounded-full bg-black/60 backdrop-blur hover:bg-black/80 sm:grid"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}
