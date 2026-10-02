// One-off: pick free-licence Unsplash photos for each landing section and write
// src/data/media.json. Images are hotlinked from Unsplash's CDN (as their
// guidelines ask), sized per card by the custom next/image loader.
import fs from "node:fs/promises";

const SECTIONS = {
  hero: [["film set camera crew", 2], ["neon city night street", 2], ["color grading film still woman", 2], ["fashion studio portrait", 2]],
  promo: [["dramatic mountain sunset cinematic", 2]],
  festival: [["cinematic film still", 8], ["moody portrait film", 6]],
  vfx: [["surreal photography", 6], ["street fashion city", 6], ["smoke explosion", 3]],
  restyle: [["street style city walk", 6], ["skateboarder", 4], ["subway portrait", 4]],
  cinematic: [["cinematic woman close up", 6], ["night car driving", 4], ["tokyo street people", 4]],
  projects: [["cinematic landscape scene", 5], ["epic fantasy scene", 4]],
  textimg: [["poster typography design", 6], ["product packaging colorful", 6]],
  marketing: [["product photography advertising", 6], ["sneaker advertising", 3], ["cosmetics product studio", 3]],
  community: [["action movie scene", 6], ["highway truck", 3], ["city aerial night", 3]],
  photodump: [["asian fashion model editorial", 7]],
  soulcinema: [["film still portrait", 8], ["vintage film photography people", 4]],
  soul: [["fashion editorial model", 8], ["street fashion portrait", 4]],
  canvas: [["bubble gum portrait", 1], ["fashion pink wall", 1]],
  supercomputer: [["influencer selfie", 3], ["skatepark", 2]],
};

const seen = new Set();
const out = {};
for (const [section, queries] of Object.entries(SECTIONS)) {
  out[section] = [];
  for (const [q, n] of queries) {
    const res = await fetch(`https://unsplash.com/napi/search/photos?query=${encodeURIComponent(q)}&per_page=30`, {
      headers: { Accept: "application/json" },
    });
    const { results } = await res.json();
    let taken = 0;
    for (const r of results) {
      if (taken >= n) break;
      if (r.premium || r.plus || seen.has(r.id) || !r.urls.raw.startsWith("https://images.unsplash.com")) continue;
      seen.add(r.id);
      taken++;
      out[section].push({
        id: r.id,
        src: r.urls.raw.split("?")[0] + "?ixid=" + new URL(r.urls.raw).searchParams.get("ixid"),
        w: r.width,
        h: r.height,
        color: r.color,
        alt: r.alt_description ?? q,
        author: r.user.name,
        link: r.links.html,
      });
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  console.log(section, out[section].length);
}
await fs.writeFile("src/data/media.json", JSON.stringify(out, null, 1));
