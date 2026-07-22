import { k, TILE, GRAVITY } from "../kaplay";
import type { Vec2, GameObj } from "kaplay";
import { makePlayer } from "../entities/player";
import { levels } from "../levels";
import type { LevelConfig } from "../types";
import { drawHeart } from "../draw";
import { showTouchControls } from "../controls";

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// The one generic level runner. Everything specific to a place comes from the
// LevelConfig data object, so this code never changes as levels are added.
export function registerLevelScene() {
  k.scene("level", (index: number) => {
    const cfg: LevelConfig = levels[index];
    k.setGravity(GRAVITY);
    showTouchControls();

    const rows = cfg.map;
    const levelWidth = Math.max(...rows.map((r) => r.length)) * TILE;
    const levelHeight = rows.length * TILE;

    drawBackground(cfg);

    // --- Build the world from the ASCII map ---
    let spawn: Vec2 = k.vec2(TILE * 2, TILE * 2);
    let totalTokens = 0;

    rows.forEach((row, ry) => {
      [...row].forEach((ch, cx) => {
        const x = cx * TILE;
        const y = ry * TILE;
        switch (ch) {
          case "=":
          case "#": {
            const openAbove = (rows[ry - 1]?.[cx] ?? " ") === " ";
            addBlock(cfg, x, y, ch === "#", openAbove);
            break;
          }
          case "*":
            addToken(k.vec2(x + TILE / 2, y + TILE / 2));
            totalTokens++;
            break;
          case "@":
            spawn = k.vec2(x + TILE / 2, y + TILE);
            break;
          case ">":
            addGoal(cfg, k.vec2(x + TILE / 2, y + TILE));
            break;
        }
      });
    });

    const player = makePlayer(spawn);
    let collected = 0;
    let finished = false;

    player.onCollide("token", (t: GameObj) => {
      collected++;
      popPlus(t.pos);
      k.destroy(t);
    });

    player.onCollide("goal", () => {
      if (finished) return;
      finished = true;
      // Little pause on the flag, then move on.
      k.wait(0.5, () => {
        if (index + 1 < levels.length) k.go("postcard", index + 1);
        else k.go("ending");
      });
    });

    // Fell off the bottom → gently place them back at the start.
    player.onUpdate(() => {
      if (player.pos.y > levelHeight + 240) {
        player.pos = spawn.clone();
        player.vel.y = 0;
      }
    });

    // --- Camera follows the player, clamped to the level bounds ---
    const halfW = k.width() / 2;
    const halfH = k.height() / 2;
    k.onUpdate(() => {
      const camX = clamp(player.pos.x, halfW, Math.max(halfW, levelWidth - halfW));
      const camY = clamp(player.pos.y - 60, halfH, Math.max(halfH, levelHeight - halfH));
      k.setCamPos(camX, camY);
    });

    // --- HUD (fixed to the screen) ---
    addHud(cfg, () => collected, () => totalTokens);
  });
}

// ---------- world pieces ----------

function addBlock(cfg: LevelConfig, x: number, y: number, underground: boolean, grassTop: boolean) {
  const base = underground ? cfg.palette.groundDark : cfg.palette.ground;
  const block = k.add([
    k.rect(TILE, TILE),
    k.color(base[0], base[1], base[2]),
    k.pos(x, y),
    k.anchor("topleft"),
    k.area(),
    k.body({ isStatic: true }),
    "ground",
    k.z(1),
  ]);
  // A brighter grass cap on blocks that have open air above them.
  if (grassTop && !underground) {
    block.onDraw(() => {
      k.drawRect({
        width: TILE,
        height: 10,
        color: k.rgb(
          Math.min(255, cfg.palette.ground[0] + 40),
          Math.min(255, cfg.palette.ground[1] + 60),
          Math.min(255, cfg.palette.ground[2] + 30),
        ),
      });
    });
  }
}

function addToken(pos: Vec2) {
  const t = k.add([
    k.pos(pos),
    k.anchor("center"),
    k.area({ shape: new k.Rect(k.vec2(0), 26, 26) }),
    k.z(5),
    "token",
    { t: k.rand(0, Math.PI * 2) },
  ]);
  // Bob up and down + draw a little heart.
  t.onUpdate(() => {
    t.t += k.dt() * 3;
  });
  t.onDraw(() => {
    const bob = Math.sin(t.t) * 4;
    drawHeart(k.vec2(0, bob), 24, k.rgb(255, 90, 120));
  });
  return t;
}

function addGoal(cfg: LevelConfig, pos: Vec2) {
  const post = k.add([
    k.pos(pos),
    k.anchor("bot"),
    k.area({ shape: new k.Rect(k.vec2(0, -TILE), TILE, TILE * 2) }),
    k.z(5),
    "goal",
  ]);
  post.onDraw(() => {
    // wooden post
    k.drawRect({ pos: k.vec2(-4, -TILE * 2), width: 8, height: TILE * 2, color: k.rgb(120, 84, 60) });
    // heart flag
    drawHeart(k.vec2(20, -TILE * 2 + 16), 34, k.rgb(255, 90, 120));
    // sign with the place + year
    k.drawText({
      text: `${cfg.place}\n${cfg.year}`,
      pos: k.vec2(-70, -TILE * 2 - 30),
      size: 16,
      width: 180,
      align: "center",
      color: k.rgb(255, 240, 245),
    });
  });
  return post;
}

// ---------- background ----------

function drawBackground(cfg: LevelConfig) {
  const p = cfg.palette;
  const bg = k.add([k.fixed(), k.z(-100)]);

  // Real pixel-art photo, if one has been dropped in for this level.
  const hasPhoto = cfg.bgImage ? k.getSprite(cfg.id) != null : false;

  bg.onDraw(() => {
    if (hasPhoto) {
      // Cover the canvas with the pixel-art background image.
      k.drawSprite({
        sprite: cfg.id,
        pos: k.vec2(0, 0),
        width: k.width(),
        height: k.height(),
      });
      return;
    }

    // Procedural placeholder sky: a soft vertical gradient.
    const bands = 32;
    for (let i = 0; i < bands; i++) {
      const f = i / (bands - 1);
      const c = k.rgb(p.skyTop[0], p.skyTop[1], p.skyTop[2]).lerp(
        k.rgb(p.skyBottom[0], p.skyBottom[1], p.skyBottom[2]),
        f,
      );
      k.drawRect({
        pos: k.vec2(0, (k.height() / bands) * i),
        width: k.width(),
        height: k.height() / bands + 1,
        color: c,
      });
    }

    // A soft sun/moon.
    k.drawCircle({ pos: k.vec2(k.width() - 140, 120), radius: 46, color: k.rgb(255, 240, 210) });

    // Parallax rolling hills based on the camera position.
    const camX = k.getCamPos().x;
    const hill = k.rgb(p.hills[0], p.hills[1], p.hills[2]);
    const offset = -(camX * 0.3) % 480;
    for (let i = -1; i < k.width() / 240 + 2; i++) {
      const hx = i * 240 + offset;
      k.drawCircle({ pos: k.vec2(hx, k.height() - 40), radius: 170, color: hill });
    }
  });
}

// ---------- HUD ----------

function addHud(cfg: LevelConfig, getCollected: () => number, getTotal: () => number) {
  const hud = k.add([k.fixed(), k.z(100)]);
  hud.onDraw(() => {
    // place name, top-left
    k.drawText({
      text: `${cfg.place} · ${cfg.year}`,
      pos: k.vec2(20, 18),
      size: 22,
      color: k.rgb(255, 245, 250),
    });
    // token counter, top-right
    drawHeart(k.vec2(k.width() - 150, 34), 24, k.rgb(255, 90, 120));
    k.drawText({
      text: `${getCollected()} / ${getTotal()} ${cfg.tokenLabel}`,
      pos: k.vec2(k.width() - 130, 22),
      size: 20,
      color: k.rgb(255, 245, 250),
    });
  });
}

// A floating "+1" that rises and fades when a token is collected.
function popPlus(pos: Vec2) {
  const label = k.add([
    k.text("+1", { size: 24 }),
    k.pos(pos),
    k.anchor("center"),
    k.color(255, 200, 215),
    k.opacity(1),
    k.z(20),
    k.lifespan(0.6),
  ]);
  label.onUpdate(() => {
    label.pos.y -= 60 * k.dt();
    label.opacity -= k.dt() / 0.6;
  });
}
