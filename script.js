// Surf Valentine: wave wash + dodgy NO button

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const result = document.getElementById("result");
const againBtn = document.getElementById("againBtn");
const choices = document.getElementById("choices");

// --- YES behavior
yesBtn.addEventListener("click", () => {
  result.hidden = false;
});

// --- Play again
againBtn.addEventListener("click", () => {
  result.hidden = true;
  resetNoButton();
});

// --- NO button dodging logic
// Strategy: whenever the cursor approaches/enters, teleport within the container.
const PAD = 10;               // keep away from edges
const DODGE_RADIUS = 80;      // how close before it runs
const TELEPORT_TRIES = 30;    // try several random spots

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRect(el) {
  return el.getBoundingClientRect();
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function resetNoButton() {
  // Put it back to the right-ish side nicely
  noBtn.style.position = "relative";
  noBtn.style.left = "0px";
  noBtn.style.top = "0px";
  noBtn.style.transform = "translateY(0px)";
}

function teleportNoButton(avoidX, avoidY) {
  const box = getRect(choices);

  // Switch to absolute so we can freely move it inside the choices container
  choices.style.position = "relative";
  noBtn.style.position = "absolute";

  const w = noBtn.offsetWidth;
  const h = noBtn.offsetHeight;

  // Coordinates inside the container
  const minX = PAD;
  const minY = PAD;
  const maxX = Math.max(PAD, box.width - w - PAD);
  const maxY = Math.max(PAD, box.height - h - PAD);

  let best = null;
  let bestDist = -1;

  for (let i = 0; i < TELEPORT_TRIES; i++) {
    const x = rand(minX, maxX);
    const y = rand(minY, maxY);

    // Compute distance from the "avoid" point
    const cx = box.left + x + w / 2;
    const cy = box.top + y + h / 2;
    const dx = cx - avoidX;
    const dy = cy - avoidY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Prefer farthest spot
    if (dist > bestDist) {
      bestDist = dist;
      best = { x, y };
    }
  }

  if (!best) return;

  noBtn.style.left = `${best.x}px`;
  noBtn.style.top = `${best.y}px`;
  noBtn.style.filter = "drop-shadow(0 14px 18px rgba(0,0,0,.12))";
}

// Dodge on hover / focus attempts
noBtn.addEventListener("mouseenter", (e) => {
  teleportNoButton(e.clientX, e.clientY);
});

// Also dodge if someone tries to tab to it or touch it
noBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  teleportNoButton(e.clientX, e.clientY);
});

// Proximity dodge: run when cursor gets too close
window.addEventListener("mousemove", (e) => {
  const r = getRect(noBtn);
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;

  const dx = cx - e.clientX;
  const dy = cy - e.clientY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < DODGE_RADIUS && result.hidden) {
    teleportNoButton(e.clientX, e.clientY);
  }
});

// Make sure NO can’t be “clicked” via keyboard
noBtn.addEventListener("click", (e) => {
  e.preventDefault();
});
