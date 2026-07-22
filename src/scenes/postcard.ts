import { k } from "../kaplay";
import { levels } from "../levels";
import { hideTouchControls } from "../controls";
import { drawHeart } from "../draw";

// A "postcard" shown before each level: the place, the year, and a warm caption.
// Sets the scene emotionally before the little platforming bit begins.
export function registerPostcardScene() {
  k.scene("postcard", (index: number) => {
    hideTouchControls();
    k.setGravity(0);
    k.setCamPos(k.width() / 2, k.height() / 2);
    const cfg = levels[index];

    k.add([k.rect(k.width(), k.height()), k.pos(0, 0), k.color(28, 20, 40), k.z(-10)]);

    const cardW = 620;
    const cardH = 380;
    const cardX = (k.width() - cardW) / 2;
    const cardY = (k.height() - cardH) / 2;

    // Card body.
    k.add([
      k.rect(cardW, cardH, { radius: 16 }),
      k.pos(cardX, cardY),
      k.color(250, 245, 240),
      k.outline(6, k.rgb(210, 180, 190)),
      k.z(0),
    ]);

    // Photo window — the pixel-art image if present, else a soft placeholder.
    const photoW = cardW - 60;
    const photoH = 190;
    const photoX = cardX + 30;
    const photoY = cardY + 30;
    const hasPhoto = cfg.bgImage ? k.getSprite(cfg.id) != null : false;

    const photo = k.add([k.pos(photoX, photoY), k.z(1)]);
    photo.onDraw(() => {
      if (hasPhoto) {
        k.drawSprite({ sprite: cfg.id, pos: k.vec2(0, 0), width: photoW, height: photoH });
      } else {
        const p = cfg.palette;
        k.drawRect({
          width: photoW,
          height: photoH,
          color: k.rgb(p.skyTop[0], p.skyTop[1], p.skyTop[2]),
        });
        k.drawRect({
          pos: k.vec2(0, photoH * 0.6),
          width: photoW,
          height: photoH * 0.4,
          color: k.rgb(p.hills[0], p.hills[1], p.hills[2]),
        });
        drawHeart(k.vec2(photoW / 2, photoH / 2), 60, k.rgb(255, 120, 150));
        k.drawText({
          text: "photo goes here",
          pos: k.vec2(photoW / 2, photoH - 22),
          anchor: "center",
          size: 14,
          color: k.rgb(255, 255, 255),
          opacity: 0.7,
        });
      }
    });

    // Chapter label.
    k.add([
      k.text(`Chapter ${index + 1}`, { size: 18 }),
      k.pos(k.width() / 2, photoY + photoH + 34),
      k.anchor("center"),
      k.color(180, 120, 140),
    ]);

    // Place + year.
    k.add([
      k.text(`${cfg.place} · ${cfg.year}`, { size: 30 }),
      k.pos(k.width() / 2, photoY + photoH + 66),
      k.anchor("center"),
      k.color(70, 45, 65),
    ]);

    // Caption.
    k.add([
      k.text(cfg.caption, { size: 20, width: cardW - 80, align: "center" }),
      k.pos(k.width() / 2, photoY + photoH + 104),
      k.anchor("top"),
      k.color(110, 90, 105),
    ]);

    const prompt = k.add([
      k.text("press space  ·  or tap  to explore", { size: 18 }),
      k.pos(k.width() / 2, cardY + cardH + 34),
      k.anchor("center"),
      k.color(230, 210, 220),
      k.opacity(1),
    ]);
    prompt.onUpdate(() => {
      prompt.opacity = 0.4 + 0.6 * Math.abs(Math.sin(k.time() * 2));
    });

    const enter = () => k.go("level", index);
    k.onButtonPress("confirm", enter);
    k.onMousePress(enter);
  });
}
