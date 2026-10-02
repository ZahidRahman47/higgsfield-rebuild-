"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Folder, Image as ImageIcon, Sparkles, Video, X } from "lucide-react";
import clsx from "clsx";
import Logo from "./Logo";
import { AccountMenu, NotificationsMenu } from "./AccountMenus";
import { useStudio } from "@/lib/store";
import { DAILY_CREDITS, MODEL_LABEL, STYLES } from "@/lib/generate";
import { MOTIONS } from "@/lib/motion";

type Menu = "image" | "video" | null;

export default function TopBar() {
  const path = usePathname();
  const [open, setOpen] = useState<Menu>(null);
  const credits = useStudio((s) => s.credits);
  const dismissed = useStudio((s) => s.bannerDismissed);
  const dismiss = useStudio((s) => s.dismissBanner);

  const item = (href: string, label: string, menu?: Menu) => (
    <div className="relative" onMouseEnter={() => setOpen(menu ?? null)}>
      <Link
        href={href}
        onClick={() => setOpen(null)}
        className={clsx(
          "block whitespace-nowrap rounded-lg px-2 py-1.5 text-[15px] transition-colors sm:px-2.5",
          path === href ? "text-lime" : "text-muted hover:text-white",
          open === menu && menu && "bg-card text-white",
        )}
      >
        {label}
      </Link>
    </div>
  );

  return (
    <header className="sticky top-0 z-40" onMouseLeave={() => setOpen(null)}>
      {!dismissed && (
        <div className="flex items-center gap-3 bg-lime px-4 py-2 text-[13px] text-black sm:text-sm">
          <span className="hidden rounded bg-pink px-1.5 py-0.5 text-[11px] font-semibold text-white sm:inline">Free plan</span>
          <p className="min-w-0 flex-1 truncate">
            <b>{DAILY_CREDITS} free credits every day.</b> No card, no countdown. Generate before you ever see a price.
          </p>
          <Link href="/image" className="hidden shrink-0 rounded-full bg-black px-4 py-1.5 font-medium text-white sm:block">
            Start creating
          </Link>
          <button aria-label="Dismiss" onClick={dismiss} className="shrink-0 p-1">
            <X className="size-4" />
          </button>
        </div>
      )}
      <nav className="flex h-14 items-center gap-1 border-b border-line/60 bg-bg/90 px-3 backdrop-blur sm:px-4">
        <Link href="/" className="mr-1 flex shrink-0 items-center gap-2 sm:mr-2" aria-label="Home">
          <Logo />
          <span className="hidden text-sm font-semibold lg:block">Higgsfield Rebuild</span>
        </Link>
        <div className="no-scrollbar flex min-w-0 items-center overflow-x-auto">
          {item("/", "Explore")}
          {item("/image", "Image", "image")}
          {item("/video", "Video", "video")}
          <span className="mx-1.5 hidden h-5 w-px bg-line md:block" />
          {item("/video?motion=crash-zoom", "Motion Presets")}
          {item("/#projects", "Projects")}
          {item("/#community", "Community")}
          {item("/assets", "Assets")}
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href="/image"
            title={`Free credits refill to ${DAILY_CREDITS} every day`}
            className="flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 text-sm"
          >
            <Sparkles className="size-3.5 text-lime" />
            <span className="tabular-nums" suppressHydrationWarning>{credits}</span>
            <span className="hidden text-muted sm:inline">credits</span>
          </Link>
          <NotificationsMenu />
          <AccountMenu />
        </div>
      </nav>
      {open && (
        <div className="absolute left-3 top-full z-50 mt-1 hidden w-[min(860px,calc(100vw-24px))] grid-cols-2 gap-6 rounded-2xl border border-line bg-panel p-5 shadow-2xl md:grid">
          {open === "image" ? (
            <>
              <MenuCol title="Features">
                <MenuLink href="/image" icon={<ImageIcon className="size-5" />} title="Create Image" sub="Generate AI images from text" onClick={() => setOpen(null)} />
                <MenuLink href="/assets" icon={<Folder className="size-5" />} title="Assets" sub="Everything you've generated" onClick={() => setOpen(null)} />
              </MenuCol>
              <MenuCol title="Styles">
                {STYLES.slice(1).map((s) => (
                  <MenuLink key={s.id} href={`/image?style=${s.id}`} thumb={s.thumb} title={s.label} sub={MODEL_LABEL} onClick={() => setOpen(null)} />
                ))}
              </MenuCol>
            </>
          ) : (
            <>
              <MenuCol title="Features">
                <MenuLink href="/video" icon={<Video className="size-5" />} title="Create Video" sub="Turn a prompt into a motion shot" onClick={() => setOpen(null)} />
                <MenuLink href="/assets?kind=video" icon={<Folder className="size-5" />} title="Video history" sub="Your motion shots" onClick={() => setOpen(null)} />
              </MenuCol>
              <MenuCol title="Camera presets">
                {MOTIONS.slice(0, 6).map((m) => (
                  <MenuLink key={m.id} href={`/video?motion=${m.id}`} icon={<span className="text-lg">{m.glyph}</span>} title={m.label} sub={m.sub} onClick={() => setOpen(null)} />
                ))}
              </MenuCol>
            </>
          )}
        </div>
      )}
    </header>
  );
}

function MenuCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm text-muted">{title}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function MenuLink(p: { href: string; title: string; sub: string; icon?: React.ReactNode; thumb?: string; onClick: () => void }) {
  return (
    <Link href={p.href} onClick={p.onClick} className="flex items-center gap-3 rounded-xl p-2 hover:bg-card">
      <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-card text-white">
        {p.thumb ? <Image src={p.thumb} alt="" width={40} height={40} className="size-full object-cover" /> : p.icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[15px]">{p.title}</span>
        <span className="block truncate text-sm text-muted">{p.sub}</span>
      </span>
    </Link>
  );
}
