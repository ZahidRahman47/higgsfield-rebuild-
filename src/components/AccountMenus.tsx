"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AlertTriangle, Bell, Check, Folder, Image as ImageIcon, Loader2, RotateCcw, Sparkles, Video } from "lucide-react";
import clsx from "clsx";
import Popover from "./Popover";
import { useStudio } from "@/lib/store";
import { DAILY_CREDITS } from "@/lib/generate";

const ago = (t: number) => {
  const s = Math.round((Date.now() - t) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

const Avatar = ({ className }: { className?: string }) => (
  <span className={clsx("block rounded-full bg-[radial-gradient(circle_at_40%_40%,#f6ffcf,#d9ff43_45%,#7a8f20)]", className)} />
);

export function AccountMenu() {
  const credits = useStudio((s) => s.credits);
  const gens = useStudio((s) => s.generations);
  const resetAll = useStudio((s) => s.resetAll);
  const [confirm, setConfirm] = useState(false);
  const ready = useMemo(() => gens.filter((g) => g.status === "ready"), [gens]);

  return (
    <Popover
      side="bottom"
      align="right"
      className="w-72 !p-0"
      trigger={(open) => (
        <button aria-label="Account" aria-expanded={open} className={clsx("block rounded-full ring-2 transition", open ? "ring-white/40" : "ring-transparent hover:ring-white/20")}>
          <Avatar className="size-8" />
        </button>
      )}
    >
      {(close) => (
        <div className="text-sm">
          <div className="flex items-center gap-3 border-b border-line p-4">
            <Avatar className="size-10" />
            <div>
              <p className="font-medium">Guest creator</p>
              <p className="text-xs text-muted">Work is saved in this browser</p>
            </div>
          </div>
          <div className="border-b border-line p-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Sparkles className="size-4 text-lime" />Credits</span>
              <span className="tabular-nums" suppressHydrationWarning>{credits} / {DAILY_CREDITS}</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-card">
              <div className="h-full rounded-full bg-lime" style={{ width: `${Math.min(100, (credits / DAILY_CREDITS) * 100)}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted">Refills to {DAILY_CREDITS} every day. Failed generations are refunded.</p>
            <p className="mt-1 text-xs text-muted" suppressHydrationWarning>{ready.length} creation{ready.length === 1 ? "" : "s"} so far</p>
          </div>
          <div className="p-2">
            {[
              { href: "/assets", icon: Folder, label: "My assets" },
              { href: "/image", icon: ImageIcon, label: "Create image" },
              { href: "/video", icon: Video, label: "Create video" },
            ].map((l) => (
              <Link key={l.href} href={l.href} onClick={close} className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-card">
                <l.icon className="size-4 text-muted" />{l.label}
              </Link>
            ))}
            <button
              onClick={() => {
                if (!confirm) return setConfirm(true);
                resetAll();
                setConfirm(false);
                close();
              }}
              onMouseLeave={() => setConfirm(false)}
              className={clsx("flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-card", confirm && "text-pink")}
            >
              <RotateCcw className="size-4" />
              {confirm ? "Click again to clear all" : "Reset demo"}
            </button>
          </div>
        </div>
      )}
    </Popover>
  );
}

export function NotificationsMenu() {
  const gens = useStudio((s) => s.generations);
  const recent = gens.slice(0, 6);
  const active = gens.some((g) => g.status === "pending");
  return (
    <Popover
      side="bottom"
      align="right"
      className="w-80 !p-0"
      trigger={(open) => (
        <button aria-label="Notifications" aria-expanded={open} className={clsx("relative hidden rounded-full p-2 hover:text-white sm:block", open ? "text-white" : "text-muted")}>
          <Bell className="size-4.5" />
          {active && <span className="absolute right-1.5 top-1.5 size-2 animate-pulse rounded-full bg-lime" />}
        </button>
      )}
    >
      {(close) => (
        <div className="text-sm">
          <p className="border-b border-line px-4 py-3 font-medium">Activity</p>
          {recent.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted">
              Nothing yet. Your generations will show up here.
              <Link href="/image" onClick={close} className="mt-3 block font-medium text-lime">Create your first image →</Link>
            </div>
          ) : (
            <ul className="max-h-96 overflow-y-auto p-2">
              {recent.map((g) => (
                <li key={g.id}>
                  <Link href={g.kind === "video" ? "/video" : "/image"} onClick={close} className="flex items-center gap-3 rounded-xl p-2 hover:bg-card">
                    <span className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-card">
                      {g.status === "ready" && (
                        // eslint-disable-next-line @next/next/no-img-element -- generated output, already cached at /api/image
                        <img src={g.url} alt="" className="size-full object-cover" loading="lazy" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{g.prompt}</span>
                      <span className="flex items-center gap-1 text-xs text-muted" suppressHydrationWarning>
                        {g.status === "pending" && <><Loader2 className="size-3 animate-spin text-lime" />Generating</>}
                        {g.status === "ready" && <><Check className="size-3 text-lime" />{g.kind === "video" ? "Motion shot" : "Image"} ready</>}
                        {g.status === "failed" && <><AlertTriangle className="size-3 text-pink" />Failed · refunded</>}
                        <span>· {ago(g.createdAt)}</span>
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Popover>
  );
}
