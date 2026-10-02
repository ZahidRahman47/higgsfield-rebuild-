"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, Copy, Download, Shuffle, Trash2, X } from "lucide-react";
import { MODEL_LABEL, styleById } from "@/lib/generate";
import { motionById } from "@/lib/motion";

export type Viewable = {
  src: string;
  prompt: string;
  style: string;
  w: number;
  h: number;
  seed: number;
  motion?: string;
};

export default function Lightbox({ item, onClose, onDelete }: { item: Viewable; onClose: () => void; onDelete?: () => void }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const motion = item.motion ? motionById(item.motion) : null;
  const remix = `/${motion ? "video" : "image"}?${new URLSearchParams({
    prompt: item.prompt,
    style: item.style,
    ...(motion ? { motion: motion.id } : {}),
  })}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 backdrop-blur-sm sm:p-6" onClick={onClose}>
      <div
        className="flex max-h-full w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-line bg-panel md:flex-row"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal
      >
        <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element -- generated output, already cached at /api/image */}
          <img
            src={item.src}
            alt={item.prompt}
            className="max-h-[60dvh] w-auto max-w-full object-contain md:max-h-[85dvh] motion-play"
            style={motion ? { animation: motion.anim } : undefined}
          />
        </div>
        <aside className="flex w-full shrink-0 flex-col gap-4 overflow-y-auto p-5 md:w-80">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">{motion ? "Motion shot" : "Image"}</span>
            <button onClick={onClose} aria-label="Close" className="rounded-full p-1.5 hover:bg-card">
              <X className="size-5" />
            </button>
          </div>
          <div>
            <p className="mb-1 text-xs uppercase tracking-wide text-muted">Prompt</p>
            <p className="text-[15px] leading-relaxed">{item.prompt}</p>
          </div>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <Meta k="Style" v={styleById(item.style).label} />
            <Meta k="Size" v={`${item.w}×${item.h}`} />
            <Meta k="Model" v={MODEL_LABEL} />
            <Meta k={motion ? "Camera" : "Seed"} v={motion ? motion.label : String(item.seed)} />
          </dl>
          <div className="mt-auto grid gap-2">
            <Link href={remix} className="flex items-center justify-center gap-2 rounded-xl bg-lime py-3 font-semibold text-black hover:bg-lime-deep">
              <Shuffle className="size-4" /> Recreate with this prompt
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  void navigator.clipboard.writeText(item.prompt);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-line bg-card py-2.5 text-sm hover:bg-card-hover"
              >
                {copied ? <Check className="size-4 text-lime" /> : <Copy className="size-4" />} {copied ? "Copied" : "Copy prompt"}
              </button>
              <a
                href={item.src}
                download={`higgsfield-rebuild-${item.seed}.jpg`}
                className="flex items-center justify-center gap-2 rounded-xl border border-line bg-card py-2.5 text-sm hover:bg-card-hover"
              >
                <Download className="size-4" /> Download
              </a>
            </div>
            {onDelete && (
              <button onClick={onDelete} className="flex items-center justify-center gap-2 rounded-xl py-2 text-sm text-muted hover:text-pink">
                <Trash2 className="size-4" /> Delete
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-lg bg-card px-3 py-2">
      <dt className="text-xs text-muted">{k}</dt>
      <dd className="truncate">{v}</dd>
    </div>
  );
}
