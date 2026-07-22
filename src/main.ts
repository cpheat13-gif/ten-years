import { k } from "./kaplay";
import { levels } from "./levels";
import { mountTouchControls } from "./controls";
import { registerTitleScene } from "./scenes/title";
import { registerPostcardScene } from "./scenes/postcard";
import { registerLevelScene } from "./scenes/level";
import { registerEndingScene } from "./scenes/ending";

// Load any real pixel-art backgrounds that have been added for a level.
// BASE_URL makes the path correct both locally ("/") and on GitHub Pages
// ("/ten-years/"). Levels without a bgImage just use the procedural placeholder.
for (const cfg of levels) {
  if (cfg.bgImage) {
    k.loadSprite(cfg.id, `${import.meta.env.BASE_URL}art/${cfg.bgImage}`);
  }
}

mountTouchControls();

registerTitleScene();
registerPostcardScene();
registerLevelScene();
registerEndingScene();

k.go("title");
