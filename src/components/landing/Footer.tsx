import Link from "next/link";

const COLS: [string, [string, string][]][] = [
  ["Create", [["AI Image", "/image"], ["AI Video", "/video"], ["Prompt Enhance", "/image"], ["Assets", "/assets"]]],
  ["Styles", [["Cinematic", "/image?style=cinematic"], ["Photoreal", "/image?style=photoreal"], ["Product", "/image?style=product"], ["Fashion", "/image?style=fashion"], ["Anime", "/image?style=anime"], ["3D Render", "/image?style=3d"]]],
  ["Camera Moves", [["Dolly In", "/video?motion=dolly-in"], ["Pan Left", "/video?motion=pan-left"], ["Crane Up", "/video?motion=rise"], ["Arc Shot", "/video?motion=orbit"], ["Handheld", "/video?motion=handheld"], ["Crash Zoom", "/video?motion=crash-zoom"]]],
  ["Explore", [["Community", "/#community"], ["Visual Effects", "/#vfx"], ["Projects", "/#projects"], ["Assets", "/assets"]]],
  ["Project", [["Source code", "https://github.com/ZahidRahman47/higgsfield-rebuild-"], ["Photos: Unsplash", "https://unsplash.com"], ["Model: FLUX on Workers AI", "https://developers.cloudflare.com/workers-ai/"]]],
];

export default function Footer() {
  return (
    <footer className="mt-10">
      <div className="bg-lime px-4 py-10 text-black sm:px-6">
        <div className="mx-auto grid max-w-[1600px] gap-8 lg:grid-cols-[1.2fr_repeat(5,1fr)]">
          <p className="display text-[34px] font-semibold sm:text-[40px]">AI-native<br />creative suite</p>
          {COLS.map(([title, links]) => (
            <div key={title}>
              <p className="mb-3 text-black/50">{title}</p>
              <ul className="space-y-2.5">
                {links.map(([l, h]) => (
                  <li key={l}><Link href={h} className="hover:underline">{l}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-[1600px] text-sm text-black/70">
          A rebuild of higgsfield.ai for the 8x engineering assignment. Not affiliated with Higgsfield, Inc.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 text-sm text-muted sm:px-6">
        <span>© 2026 Higgsfield Rebuild</span>
        <span>Free credits refill daily · No sign-up required</span>
      </div>
    </footer>
  );
}
