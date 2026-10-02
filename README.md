# Higgsfield Rebuild

A rebuild of [higgsfield.ai](https://higgsfield.ai), an AI image and video studio, for the 8x engineering assignment.

**Live:** https://higgsfield-rebuild-phi.vercel.app (no sign-up needed)
**Agent logs:** [`.agent-logs/`](.agent-logs/) · capture setup in [`CAPTURE-TEST.md`](CAPTURE-TEST.md)
**Recon:** screenshots of the original and my notes in [`recon/`](recon/)

## What I found using the original

I signed up and went through the flows ([recon/NOTES.md](recon/NOTES.md)). Underneath roughly 55 menu entries, the core loop is: **prompt → pick a model → spend credits → get a result → keep it or share it.**

The biggest problem: **a free user can't complete that loop.** The flow is sign-up → a 6-step quiz → a "personal 50% OFF" pop-up with a countdown → a paywall. Clicking Generate on both image and video opens another paywall. The quiz even asks which frustrations you have ("prompting is hard", "high cost", "I'm new to this") and then nothing uses the answers.

## What I built first, and why

The core loop, working for anyone who opens the link:

- **Explore**: the original's landing page, section by section (hero row, tool tiles, film-festival wall, the VFX / restyle / cinematic galleries with fade and "View all", project cards, lime studio panel, banners, lime footer). Every tile opens Create with that photo's description already filled in as the prompt.
- **Create Image**: the original's layout. It has a bottom prompt bar with style, aspect, quality, Enhance, and a 1–4 batch. **The credit cost and your balance are on the Generate button before you click.** Results appear in place with a live timer, survive a reload, and failed images refund their credits automatically and offer Retry.
- **Create Video**: the original's side panel. Pick a prompt, a style and one of 8 camera moves (dolly, crane, arc, handheld, crash zoom…). On the free tier, this is an AI keyframe animated with a real camera move, and the panel says so.
- **Assets**: everything you've made, with All / Images / Videos tabs, a lightbox, download, copy prompt, recreate and delete.
- **100 free credits every day, no sign-up wall, no countdown.** You can generate before you ever see a price.

## What I left out on purpose

Payments, auth, contests, blogs, the ChatGPT/MCP/API products, enterprise, and the 50+ niche tools. I also didn't copy Higgsfield's model names (Seedance, Soul, Genjutsu…), because this app doesn't run those models and claiming them would be misleading.

## How it's built

Next.js 16 (App Router) · TypeScript · Tailwind 4 · TanStack Query · zustand · Vercel

- **`/api/image`** is the only route that talks to a model ([src/lib/provider.ts](src/lib/provider.ts)). It uses Cloudflare Workers AI FLUX.1 schnell when `CF_ACCOUNT_ID` and `CF_API_TOKEN` are set, and falls back to the keyless Pollinations API with bounded retries otherwise.
- **Generations are deterministic URLs** of (prompt, style, size, seed). That has three effects:
  - Results are served with `immutable` cache headers, so a repeat or shared image comes from the CDN, not the model.
  - A generation still pending when the page reloads simply resumes.
  - History is stored locally as parameters, not image bytes.
- **TanStack Query mutations** handle generate and retry: credits are spent up front, each image settles on its own, and failures are refunded.
- **Performance:**
  - The landing page is server-rendered and static, with CSS-column masonry and no client JS for the galleries.
  - `next/image` uses a custom loader, so Unsplash's CDN serves each photo already resized for each breakpoint, with no re-encoding.
  - Photos below the fold load lazily, and each shows its dominant colour as a placeholder while it loads.
  - Generation tiles are memoized, and their callbacks are stable so typing in the prompt doesn't re-render the grid.
  - Persisted state hydrates after mount to avoid mismatches between the server and client render.

## Run it

```bash
npm install
cp .env.example .env.local   # optional: Cloudflare keys for fast FLUX generation
npm run dev
```

## Honest limitations

- Without Cloudflare keys, the free fallback API is rate-limited per server IP, so generation can be slow or fail. Failures are refunded and can be retried.
- "Video" on the free tier is a keyframe plus a camera move, not a video model.
- History and credits live in your browser (no accounts yet).
- Landing-page photos are free-licence images from [Unsplash](https://unsplash.com), credited on hover.

Not affiliated with Higgsfield, Inc.
