const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const result = document.getElementById("result");
const againBtn = document.getElementById("againBtn");
const choices = document.getElementById("choices");

// YES shows success screen
yesBtn.addEventListener("click", () => {
  result.hidden = false;
});

// Play again hides it + resets NO
againBtn.addEventListener("click", () => {
  result.hidden = true;
  resetNoButton();
});

// ---------- NO BUTTON DODGE ----------
const PAD = 8;
const DODGE_RADIUS = 110;
const TELEPORT_TRIES = 30;

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRect(el) {
  return el.getBoundingClientRect();
}

function resetNoButton() {
  noBtn.style.position = "relative";
  noBtn.style.left = "0px";
  noBtn.style.top = "0px";
}

function teleportNoButton(avoidX, avoidY) {
  const box = getRect(choices);

  // Ensure container allows absolute positioning
  choices.style.position = "relative";
  noBtn.style.position = "absolute";

  const w = noBtn.offsetWidth;
  const h = noBtn.offsetHeight;

  const minX = PAD;
  const minY = PAD;
  const maxX = Math.max(PAD, box.width - w - PAD);
  const maxY = Math.max(PAD, box.height - h - PAD);

  let best = null;
  let bestDist = -1;

  for (let i = 0; i < TELEPORT_TRIES; i++) {
    const x = rand(minX, maxX);
    const y = rand(minY, maxY);

    const cx = box.left + x + w / 2;
    const cy = box.top + y + h / 2;

    const dx = cx - avoidX;
    const dy = cy - avoidY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > bestDist) {
      bestDist = dist;
      best = { x, y };
    }
  }

  if (!best) return;

  noBtn.style.left = `${best.x}px`;
  noBtn.style.top = `${best.y}px`;
}

// Dodge when mouse enters
noBtn.addEventListener("mouseenter", (e) => {
  teleportNoButton(e.clientX, e.clientY);
});

// Dodge on touch/press
noBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  teleportNoButton(e.clientX, e.clientY);
});

// Dodge when cursor gets close
window.addEventListener("mousemove", (e) => {
  if (!result.hidden) return;

  const r = getRect(noBtn);
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;

  const dx = cx - e.clientX;
  const dy = cy - e.clientY;

  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < DODGE_RADIUS) {
    teleportNoButton(e.clientX, e.clientY);
  }
});

// Prevent NO from ever registering a click
noBtn.addEventListener("click", (e) => e.preventDefault());
