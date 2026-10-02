import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function SectionHead({ title, sub, cta }: { title: string; sub: string; cta?: { label: string; href: string } }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="display text-[26px] text-lime sm:text-[32px]">{title}</h2>
        <p className="mt-1 text-sm text-muted">{sub}</p>
      </div>
      {cta && (
        <Link href={cta.href} className="hidden shrink-0 rounded-xl bg-lime px-4 py-2.5 text-[15px] font-semibold text-black shadow-[0_3px_0_#8fae12] hover:bg-lime-deep sm:block">
          {cta.label}
        </Link>
      )}
    </div>
  );
}

export function ViewAll({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-xl border border-lime/20 bg-[#2b3311]/90 px-4 py-2.5 text-[15px] font-medium text-lime backdrop-blur hover:bg-[#36410f]"
    >
      {label} <ArrowUpRight className="size-4" />
    </Link>
  );
}
