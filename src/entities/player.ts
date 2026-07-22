import { k, MOVE_SPEED, JUMP_FORCE } from "../kaplay";
import type { Vec2, GameObj } from "kaplay";

// Spawns the cute little character and wires up movement + jumping.
// Returns the game object so the level can watch it (collisions, camera, etc.).
export function makePlayer(pos: Vec2): GameObj {
  const player = k.add([
    k.rect(34, 44, { radius: 8 }),
    k.color(255, 138, 176), // warm pink
    k.outline(4, k.rgb(60, 30, 55)),
    k.pos(pos),
    k.anchor("bot"),
    k.area({ scale: k.vec2(0.9, 1) }),
    k.body({ jumpForce: JUMP_FORCE }),
    k.z(10),
    "player",
    { facing: 1 as 1 | -1 },
  ]);

  // A simple face drawn on top, flipping with the direction of travel.
  player.onDraw(() => {
    const eyeY = -30;
    const dx = 7 * player.facing;
    k.drawCircle({ pos: k.vec2(dx - 6, eyeY), radius: 3.5, color: k.rgb(60, 30, 55) });
    k.drawCircle({ pos: k.vec2(dx + 6, eyeY), radius: 3.5, color: k.rgb(60, 30, 55) });
    // rosy cheek
    k.drawCircle({ pos: k.vec2(dx, eyeY + 9), radius: 4, color: k.rgb(255, 190, 205) });
  });

  // Horizontal movement, sampled every frame from the named input buttons
  // (keyboard or on-screen touch buttons — see src/controls.ts).
  player.onUpdate(() => {
    let vx = 0;
    if (k.isButtonDown("left")) vx -= MOVE_SPEED;
    if (k.isButtonDown("right")) vx += MOVE_SPEED;
    if (vx !== 0) player.facing = vx > 0 ? 1 : -1;
    player.move(vx, 0);
  });

  // Jump only when standing on something.
  k.onButtonPress("jump", () => {
    if (player.isGrounded()) player.jump();
  });

  return player;
}
