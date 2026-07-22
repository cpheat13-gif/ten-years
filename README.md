# Ten Years ♥

A cute little side-scrolling platformer — a gift celebrating ten years together.
Each level is a place we've lived, worked, or a memory we share, played in order
so the whole game walks through our story. Collect the little hearts, reach the
signpost, and move on to the next chapter.

Built with [Kaplay](https://kaplayjs.com) + Vite + TypeScript. Runs in any
browser, on a laptop or a phone.

## Play it locally

```bash
npm install
npm run dev
```

Then open the link it prints (usually http://localhost:5173).

**Controls**
- Move: **← →** or **A D**
- Jump: **Space**, **↑**, or **W**
- On a phone: use the on-screen buttons.

## Make it yours

Everything personal lives in plain data files — no game code to touch.

### Edit a place / memory
Open `src/levels/level-01.ts` (and `level-02.ts`) and change:
- `place` — e.g. `"Portland, Oregon"`
- `year` — e.g. `"2016"` or `"2016–2018"`
- `caption` — the warm line shown on the postcard
- `tokenLabel` — what the collectibles represent (`"coffees"`, `"seashells"`, …)

### Reshape a level
Edit the `map` — one string per row. Legend:

| symbol | meaning                          |
|--------|----------------------------------|
| `=`    | ground / platform block          |
| `#`    | underground dirt block           |
| `*`    | a heart to collect               |
| `@`    | where the player starts (one)    |
| `>`    | the goal signpost (finish line)  |
| space  | empty air                        |

### Add a real photo (pixel-art)
Turn a photo of the place into a pixel-art background:

```bash
npm run pixelate -- /path/to/photo.jpg level-01
```

That writes `public/art/level-01.png`. Then in `src/levels/level-01.ts`
uncomment / set:

```ts
bgImage: "level-01.png",
```

The photo shows both on that chapter's postcard and as the level background.

### Add more chapters
Copy `src/levels/level-02.ts` to `level-03.ts`, tweak it, and add it to the list
in `src/levels/index.ts`. The title → postcard → level → ending flow adapts
automatically.

## Share it online

Pushing to `main` builds the game and publishes it to **GitHub Pages** via
`.github/workflows/deploy.yml`. One-time setup: in the repo, go to
**Settings → Pages → Build and deployment → Source: GitHub Actions**. After the
first successful run it's live at:

```
https://cpheat13-gif.github.io/ten-years/
```
