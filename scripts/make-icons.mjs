// One-off: render the apple touch icon and the social share card from SVG.
import sharp from "sharp";
import fs from "node:fs/promises";

const mark = (s) => `<rect width="${s}" height="${s}" rx="${s * 0.28}" fill="#d9ff43"/>
  <path transform="scale(${s / 32})" d="M8 21c2.5-6 5-10 7-10s-1 9 1.5 9S22 11 24.5 11" fill="none" stroke="#0c0c0e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;

await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">${mark(180)}</svg>`)).png().toFile("src/app/apple-icon.png");

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#0c0c0e"/>
  <rect x="0" y="560" width="1200" height="70" fill="#d9ff43"/>
  <g transform="translate(80,80)">${mark(96)}</g>
  <text x="200" y="145" font-family="Helvetica, Arial" font-size="40" font-weight="700" fill="#fff">Higgsfield Rebuild</text>
  <text x="80" y="330" font-family="Helvetica, Arial" font-size="80" font-weight="900" fill="#fff">AI IMAGE &amp; VIDEO STUDIO</text>
  <text x="80" y="440" font-family="Helvetica, Arial" font-size="64" font-weight="900" fill="#d9ff43">100 FREE CREDITS EVERY DAY</text>
  <text x="80" y="606" font-family="Helvetica, Arial" font-size="30" font-weight="600" fill="#0c0c0e">No sign-up wall · cost shown before you generate · 8 camera moves</text>
</svg>`;
await sharp(Buffer.from(og)).png().toFile("src/app/opengraph-image.png");
await fs.copyFile("src/app/opengraph-image.png", "src/app/twitter-image.png");
console.log("icons done");
