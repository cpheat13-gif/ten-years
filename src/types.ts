// The shape of a single level. Everything that makes a level personal lives
// here as plain data, so adding the remaining years later is just adding more
// of these objects — no engine changes required.
export type LevelConfig = {
  /** Short id, also used as the background image key if `bgImage` is set. */
  id: string;
  /** The place — "Portland, Oregon", "Our first apartment", etc. */
  place: string;
  /** When it was — "2016" or "2016–2018". */
  year: string;
  /** One warm line shown on the postcard before the level. */
  caption: string;
  /** What the collectibles in this level represent — "coffee cups", "seashells". */
  tokenLabel: string;

  /**
   * ASCII layout, one string per row. Symbols:
   *   '='  solid ground / platform block
   *   '#'  solid dirt block (same as '=', different look underground)
   *   '*'  a memory token to collect
   *   '@'  where the player starts (exactly one)
   *   '>'  the goal signpost that finishes the level
   *   ' '  empty air
   */
  map: string[];

  /** Placeholder look, used until a real pixel-art photo is dropped in. */
  palette: {
    skyTop: [number, number, number];
    skyBottom: [number, number, number];
    hills: [number, number, number];
    ground: [number, number, number];
    groundDark: [number, number, number];
  };

  /**
   * Optional: filename in public/art/ of the pixel-art background made from a
   * real photo (see scripts/pixelate.mjs). When present it is drawn instead of
   * the procedural placeholder sky.
   */
  bgImage?: string;
};
