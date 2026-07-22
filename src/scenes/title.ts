import { k } from "../kaplay";
import { drawHeart } from "../draw";
import { hideTouchControls } from "../controls";

// The opening screen: title, a soft drift of hearts, and a prompt to begin.
export function registerTitleScene() {
  k.scene("title", () => {
    hideTouchControls();
    k.setGravity(0);
    k.setCamPos(k.width() / 2, k.height() / 2);

    // Dusk gradient backdrop.
    k.add([
      k.rect(k.width(), k.height()),
      k.pos(0, 0),
      k.color(38, 26, 58),
      k.z(-10),
    ]);

    // A handful of hearts drifting gently upward.
    for (let i = 0; i < 14; i++) {
      const h = k.add([
        k.pos(k.rand(0, k.width()), k.rand(0, k.height())),
        k.opacity(k.rand(0.2, 0.6)),
        k.z(-5),
        { size: k.rand(14, 30), speed: k.rand(12, 34) },
      ]);
      h.onUpdate(() => {
        h.pos.y -= h.speed * k.dt();
        if (h.pos.y < -30) {
          h.pos.y = k.height() + 30;
          h.pos.x = k.rand(0, k.width());
        }
      });
      h.onDraw(() => drawHeart(k.vec2(0, 0), h.size, k.rgb(255, 120, 150).darken(0)));
    }

    k.add([
      k.text("Ten Years", { size: 84 }),
      k.pos(k.width() / 2, k.height() / 2 - 60),
      k.anchor("center"),
      k.color(255, 235, 245),
    ]);

    const heartRow = k.add([k.pos(k.width() / 2, k.height() / 2 + 6), k.anchor("center")]);
    heartRow.onDraw(() => {
      for (let i = 0; i < 10; i++) {
        drawHeart(k.vec2((i - 4.5) * 34, 0), 22, k.rgb(255, 90, 120));
      }
    });

    k.add([
      k.text("ten years, ten places — a little journey, just for you", { size: 22 }),
      k.pos(k.width() / 2, k.height() / 2 + 70),
      k.anchor("center"),
      k.color(255, 210, 225),
    ]);

    const prompt = k.add([
      k.text("press space  ·  or tap  to begin", { size: 20 }),
      k.pos(k.width() / 2, k.height() - 70),
      k.anchor("center"),
      k.color(255, 240, 245),
      k.opacity(1),
    ]);
    prompt.onUpdate(() => {
      prompt.opacity = 0.4 + 0.6 * Math.abs(Math.sin(k.time() * 2));
    });

    const begin = () => k.go("postcard", 0);
    k.onButtonPress("confirm", begin);
    k.onMousePress(begin);
  });
}
