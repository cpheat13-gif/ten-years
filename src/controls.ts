import { k } from "./kaplay";

// On-screen touch controls so the game is playable on a phone. On desktop
// (no touch) these stay hidden and the keyboard is used instead.
//
// The buttons drive Kaplay's virtual button system (pressButton/releaseButton),
// so the exact same "left"/"right"/"jump" actions fire whether input comes from
// the keyboard or a thumb.

const isTouch =
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

let container: HTMLDivElement | null = null;

function press(btn: string) {
  (k as unknown as { pressButton: (b: string) => void }).pressButton(btn);
}
function release(btn: string) {
  (k as unknown as { releaseButton: (b: string) => void }).releaseButton(btn);
}

function makeButton(label: string, btn: string, side: "left" | "right"): HTMLDivElement {
  const el = document.createElement("div");
  el.textContent = label;
  Object.assign(el.style, {
    position: "absolute",
    bottom: "24px",
    [side]: side === "left" ? "24px" : "24px",
    width: "84px",
    height: "84px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.16)",
    border: "2px solid rgba(255,255,255,0.35)",
    color: "rgba(255,255,255,0.9)",
    font: "28px system-ui, sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    touchAction: "none",
    userSelect: "none",
  });

  const down = (e: Event) => {
    e.preventDefault();
    press(btn);
    el.style.background = "rgba(255,255,255,0.32)";
  };
  const up = (e: Event) => {
    e.preventDefault();
    release(btn);
    el.style.background = "rgba(255,255,255,0.16)";
  };
  el.addEventListener("pointerdown", down);
  el.addEventListener("pointerup", up);
  el.addEventListener("pointerleave", up);
  el.addEventListener("pointercancel", up);
  return el;
}

/** Build the touch overlay once. Safe to call multiple times. */
export function mountTouchControls() {
  if (!isTouch || container) return;

  container = document.createElement("div");
  Object.assign(container.style, {
    position: "absolute",
    inset: "0",
    pointerEvents: "none",
    zIndex: "10",
    display: "none",
  });

  // Left/right on the left thumb, jump on the right thumb.
  const left = makeButton("◀", "left", "left");
  const right = makeButton("▶", "right", "left");
  right.style.left = "120px";
  const jump = makeButton("⤒", "jump", "right");

  for (const b of [left, right, jump]) {
    b.style.pointerEvents = "auto";
    container.appendChild(b);
  }
  document.body.appendChild(container);
}

export function showTouchControls() {
  if (container) container.style.display = "block";
}

export function hideTouchControls() {
  if (container) container.style.display = "none";
}
