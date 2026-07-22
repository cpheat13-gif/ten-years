import { k } from "../kaplay";
import { drawHeart } from "../draw";
import { hideTouchControls } from "../controls";

// End of the prototype. For now it's a warm "to be continued" — the remaining
// years get added later as more level configs.
export function registerEndingScene() {
  k.scene("ending", () => {
    hideTouchControls();
    k.setGravity(0);
    k.setCamPos(k.width() / 2, k.height() / 2);

    k.add([k.rect(k.width(), k.height()), k.pos(0, 0), k.color(30, 20, 46), k.z(-10)]);

    const hearts = k.add([k.pos(k.width() / 2, k.height() / 2 - 120), k.anchor("center")]);
    hearts.onDraw(() => {
      for (let i = 0; i < 5; i++) {
        const s = 34 + Math.sin(k.time() * 2 + i) * 6;
        drawHeart(k.vec2((i - 2) * 60, 0), s, k.rgb(255, 90, 120));
      }
    });

    k.add([
      k.text("to be continued…", { size: 56 }),
      k.pos(k.width() / 2, k.height() / 2),
      k.anchor("center"),
      k.color(255, 235, 245),
    ]);

    k.add([
      k.text("ten years, and so many more places to go together  ♥", {
        size: 22,
        width: 700,
        align: "center",
      }),
      k.pos(k.width() / 2, k.height() / 2 + 70),
      k.anchor("center"),
      k.color(255, 210, 225),
    ]);

    const prompt = k.add([
      k.text("press space  ·  or tap  to play again", { size: 18 }),
      k.pos(k.width() / 2, k.height() - 60),
      k.anchor("center"),
      k.color(230, 210, 220),
      k.opacity(1),
    ]);
    prompt.onUpdate(() => {
      prompt.opacity = 0.4 + 0.6 * Math.abs(Math.sin(k.time() * 2));
    });

    const again = () => k.go("title");
    k.onButtonPress("confirm", again);
    k.onMousePress(again);
  });
}
