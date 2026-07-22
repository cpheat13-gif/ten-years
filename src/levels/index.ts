import type { LevelConfig } from "../types";
import level01 from "./level-01";
import level02 from "./level-02";

// The ordered journey. Add more chapters by importing another level file and
// appending it here — the title/postcard/level flow adapts automatically.
export const levels: LevelConfig[] = [level01, level02];
