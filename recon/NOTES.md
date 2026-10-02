# Higgsfield recon: product map and observations

Screenshots taken 2026-10-02 and numbered in the order the flow happened.

## What the product is

At its core, Higgsfield is an **AI image and video generation studio**. It's a single front end over many third-party models, plus its own models (Soul, Genjutsu). Credits are the billing unit. Around that core it adds a community feed, public profiles, and a long list of specialised tools.

The core loop, with everything else stripped away:

> **prompt (+ optional reference) → pick a model → spend credits → get an image or video → keep it in Assets → share or remix it**

## The flows I went through

| # | Screen | What happens |
|---|---|---|
| 00, 11 | Landing / Explore | A long feed: promo carousel, a "50% OFF" hero, tool tiles (Seedance, Nano Banana Pro, Genjutsu, MCP, Cinema Studio, Supercomputer), then a showcase section for each model (Visual Effects, Genjutsu, Seedance, GPT Image, Marketing Studio, Soul…) and a footer with a big link index |
| 01 | Sign-up modal | Google / Apple / Microsoft / email, plus "business email → 50 credits". A video carousel shows off the models on the left |
| 02 | SSO callback | "Wait just a moment…" |
| 03–08 | Onboarding quiz, 6 steps | Personal or team → goal → which flagship studios → which features → how you heard about us → which AI frustration to solve |
| 09 | Offer modal | "Congratulations! a personal 50% OFF offer", a promo code, and a 2h 58m countdown |
| 10 | Paywall | PRO $20/mo (600 credits ≈ 300 Nano Banana images ≈ 27 Seedance videos), MAX $50/mo (1,800 credits), monthly/annual toggle, credit slider |
| 12 | Profile `/@handle` | All works / Projects / Blogs / Generations tabs, views and likes, followers. All empty. "Create project" / "Create blog" |
| 13 | Image mega-menu | 13 features (Create Image, Cinematic Cameras, Canvas, Soul ID, AI Influencer, Relight, Inpaint, Upscale, Face Swap…) + 13 models |
| 14 | Video mega-menu | 14+ features (Create Video, Cinema Studio, 3D Jutsu, Shorts, Explainer, Click to Ad…) + 15+ models (Seedance, Kling, Veo, Wan, Grok, MiniMax…) |

**Gap: I don't have screenshots of an actual generation yet.** That covers the Create Image / Create Video page, the prompt box and settings, the waiting state, the result, and the Assets library. That's the core of the product, so I need it captured before we design the main screen.

## What is wrong with it (where we can be better)

1. **Too much choice, not enough guidance.** The top nav has 15+ items and gets cut off ("Supercom…"). The two mega-menus list about 55 entries. "Features" and "models" are separate lists, and the same tool (Canvas, Relight) shows up in both menus. A new user has to know the difference between Seedance 2.5, Kling 3.0 and Veo 3.1 before they can make anything.
2. **The quiz asks the right questions, then ignores the answers.** Its last step lists the real pain points: *prompting is hard, inconsistent results, high cost of top models, limited generations, I'm new to this*. Right after it comes a paywall, not a first generation. Nothing in these screenshots shows the answers being used afterwards.
3. **Upsell before value.** A countdown banner sits at the top of every page, a "personal 50% OFF" modal appears straight after onboarding, and a pricing wall follows, all before the user has generated a single thing.
4. **Credits are opaque.** "600 credits" only means something through footnotes like "≈ 27 Seedance videos". There's no price per generation shown at the moment you decide to generate.
5. **Empty states are a dead end.** The profile shows three empty sections (Projects, Blogs, Generations) and asks a brand-new user to "Create blog" instead of pointing them to their first generation.

## The product thesis for the rebuild

**One focused studio that takes you from idea to result in under a minute, built around the frustrations the original's own quiz names:**

- **"Prompting is hard"**: prompt enhancement plus a few starting presets/styles. You describe it roughly and we write the detailed prompt.
- **"Which model?"**: you choose *what you're making* (image or video, and the look), and we choose the model, with an override for power users.
- **"High cost / limited generations"**: the credit cost is shown on the Generate button *before* you click, and there's a visible balance.
- **"Inconsistent results"**: variations and "remix this" on any result, so iterating is one click.
- **Value before paywall**: free credits for guests and you can try it straight away. Sign-up only happens when you want to save your work.

### Build first (the core loop)
1. The Create workspace: a prompt, image/video mode, a style/model picker, a cost preview, and Generate
2. Real generation through a model API, with a queue and progress, and results appearing in place
3. An Assets library (your generations), with download, remix and delete
4. An Explore feed of public generations that you can open → "use this prompt"
5. Lightweight auth and a credit balance

### Leave out
Contests, blogs/projects, ChatGPT plugin / MCP / API, Enterprise, the Ads and Marketing studios, Supercomputer, the 50+ niche tools, real payments (credits are simulated), and the countdown upsells.
