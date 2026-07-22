// Turn a normal photo into a crisp pixel-art background for a level.
//
//   npm run pixelate -- <path-to-photo> <output-name> [pixelWidth]
//
// Examples:
//   npm run pixelate -- ~/Downloads/portland.jpg level-01
//   npm run pixelate -- ./beach.png level-02 200
//
// It downscales the photo to a low resolution, snaps the colours to a small
// retro palette, then scales it back up with hard (nearest-neighbour) edges so
// it reads as pixel art. Output lands in public/art/<output-name>.png — then set
// `bgImage: "<output-name>.png"` in that level's config.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const [, , input, name, widthArg] = process.argv;

if (!input || !name) {
  console.error("Usage: npm run pixelate -- <photo> <output-name> [pixelWidth]");
  process.exit(1);
}

// Low internal resolution (16:9). Smaller = chunkier pixels.
const pxW = Number.parseInt(widthArg ?? "160", 10);
const pxH = Math.round((pxW * 9) / 16);

// Final size the game draws it at.
const outW = 960;
const outH = 540;

const outPath = `public/art/${name}.png`;

await mkdir("public/art", { recursive: true });

// 1) shrink + reduce to a limited colour palette
const small = await sharp(input)
  .resize(pxW, pxH, { fit: "cover", kernel: "nearest" })
  .png({ palette: true, colors: 32, dither: 0.5 })
  .toBuffer();

// 2) blow it back up with hard pixel edges
await sharp(small).resize(outW, outH, { kernel: "nearest" }).png().toFile(outPath);

console.log(`✓ wrote ${outPath}  (${pxW}×${pxH} → ${outW}×${outH})`);
console.log(`  now set  bgImage: "${name}.png"  in that level's config.`);
