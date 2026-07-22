import type { LevelConfig } from "../types";

// ── Chapter 1 ────────────────────────────────────────────────────────────────
// Replace `place`, `year`, `caption`, and `tokenLabel` with your real first
// memory. Drop a photo into public/art/ (see scripts/pixelate.mjs) and set
// `bgImage` to use it. Edit the `map` below to reshape the level — the legend
// is documented in src/types.ts.
const level01: LevelConfig = {
  id: "level-01",
  place: "Norman Brothers Produce",
  year: "2016",
  caption: "The Fresh Approach — where it all began.",
  tokenLabel: "memories",

  palette: {
    skyTop: [86, 110, 180],
    skyBottom: [255, 170, 140],
    hills: [150, 110, 160],
    ground: [104, 168, 88],
    groundDark: [72, 110, 64],
  },

  bgImage: "level-01.png",

  map: [
    "                                              ",
    "                                              ",
    "                                              ",
    "                                              ",
    "                         *                    ",
    "         *              ===                   ",
    "        ===        *               *          ",
    "                  ===             ===         ",
    "                                              ",
    "   @  *               *                 *    >",
    "==============  ==============  ================",
    "##############  ##############  ################",
  ],
};

export default level01;
