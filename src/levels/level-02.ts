import type { LevelConfig } from "../types";

// ── Chapter 2 ────────────────────────────────────────────────────────────────
// Same idea as chapter 1 — swap in your second place/memory and (optionally) a
// photo. Copy this file to add chapter 3, 4, … and list it in ./index.ts.
const level02: LevelConfig = {
  id: "level-02",
  place: "Our First Home",
  year: "2018",
  caption: "The first place that was truly ours — coffee, boxes, and us.",
  tokenLabel: "coffees",

  palette: {
    skyTop: [120, 180, 235],
    skyBottom: [205, 232, 246],
    hills: [110, 150, 120],
    ground: [120, 175, 95],
    groundDark: [86, 120, 70],
  },

  // bgImage: "level-02.png",

  map: [
    "                                                    ",
    "                                                    ",
    "                                                    ",
    "                                                    ",
    "               *                     *              ",
    "              ===                    ===            ",
    "       *               *                     *      ",
    "      ===             ===                    ===    ",
    "                                                    ",
    "  @     *           *             *                >",
    "============  ============   ===========  ==========",
    "############  ############   ###########  ##########",
  ],
};

export default level02;
