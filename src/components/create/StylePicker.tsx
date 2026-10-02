"use client";

import Image from "next/image";
import { ChevronRight, Check } from "lucide-react";
import Popover, { Chip } from "@/components/Popover";
import { STYLES, styleById } from "@/lib/generate";

export default function StylePicker({ value, onChange, side = "top" }: { value: string; onChange: (id: string) => void; side?: "top" | "bottom" }) {
  const cur = styleById(value);
  return (
    <Popover
      side={side}
      className="w-72"
      trigger={(open) => (
        <Chip active={open}>
          <Image src={cur.thumb} alt="" width={20} height={20} className="size-5 rounded object-cover" />
          {cur.label}
          <ChevronRight className="size-4 text-muted" />
        </Chip>
      )}
    >
      {(close) => (
        <div>
          <p className="px-2 pb-2 pt-1 text-xs text-muted">Style · applied on top of your prompt</p>
          {STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                onChange(s.id);
                close();
              }}
              className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-card"
            >
              <Image src={s.thumb} alt="" width={40} height={40} className="size-10 rounded-lg object-cover" />
              <span className="flex-1">
                <span className="block text-sm">{s.label}</span>
                <span className="block truncate text-xs text-muted">{s.suffix || "No style, your prompt as written"}</span>
              </span>
              {s.id === value && <Check className="size-4 text-lime" />}
            </button>
          ))}
        </div>
      )}
    </Popover>
  );
}
