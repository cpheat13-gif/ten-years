import { k } from "./kaplay";
import type { Vec2, Color } from "kaplay";

// Draws a little heart centred on `pos` (in the current drawing space).
// Used for collectibles, the goal flag, and HUD icons.
export function drawHeart(pos: Vec2, size: number, color: Color) {
  const r = size * 0.28;
  k.drawCircle({ pos: k.vec2(pos.x - r * 0.9, pos.y - r * 0.5), radius: r, color });
  k.drawCircle({ pos: k.vec2(pos.x + r * 0.9, pos.y - r * 0.5), radius: r, color });
  k.drawPolygon({
    pts: [
      k.vec2(pos.x - size * 0.5, pos.y - r * 0.3),
      k.vec2(pos.x + size * 0.5, pos.y - r * 0.3),
      k.vec2(pos.x, pos.y + size * 0.55),
    ],
    color,
  });
}
