"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

export default function Popover({
  trigger,
  children,
  align = "left",
  side = "top",
  className,
}: {
  trigger: (open: boolean) => React.ReactNode;
  children: (close: () => void) => React.ReactNode;
  align?: "left" | "right";
  side?: "top" | "bottom";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen((o) => !o)}>{trigger(open)}</div>
      {open && (
        <div
          className={clsx(
            "absolute z-30 rounded-2xl border border-line bg-panel p-2 shadow-2xl",
            side === "top" ? "bottom-full mb-2" : "top-full mt-2",
            align === "left" ? "left-0" : "right-0",
            className,
          )}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

export function Chip({ active, children, className }: { active?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <span
      className={clsx(
        "flex h-10 cursor-pointer select-none items-center gap-2 whitespace-nowrap rounded-xl border px-3 text-sm transition-colors",
        active ? "border-white/30 bg-card-hover" : "border-line bg-card hover:bg-card-hover",
        className,
      )}
    >
      {children}
    </span>
  );
}
