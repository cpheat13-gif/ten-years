import kaplay from "kaplay";

// A single shared Kaplay context used by every scene/entity.
// We keep `global: false` so Kaplay's helpers live on `k` instead of
// polluting the global namespace — nicer with TypeScript.
export const k = kaplay({
  width: 960,
  height: 540,
  letterbox: true, // keep the 16:9 canvas centered with bars on odd screens
  crisp: true, // nearest-neighbour scaling → crisp pixel art
  pixelDensity: 1,
  background: [20, 16, 31], // deep dusk purple behind everything
  global: false,
  buttons: {
    // Named input actions, bound to keyboard here and to on-screen
    // buttons in src/controls.ts. Query with k.isButtonDown("left") etc.
    left: { keyboard: ["left", "a"] },
    right: { keyboard: ["right", "d"] },
    jump: { keyboard: ["space", "up", "w"] },
    confirm: { keyboard: ["space", "enter"] },
  },
});

// Shared tuning knobs so the feel is easy to adjust in one place.
export const TILE = 48;
export const GRAVITY = 1800;
export const MOVE_SPEED = 300;
export const JUMP_FORCE = 780;
