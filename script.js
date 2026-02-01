
// Tiny Valentine clicker + unlock message.
// Customize: TARGET, SECRET_CODE, and the unlocked message text.

const TARGET = 12;
const SECRET_CODE = "pingu"; // <-- change to your inside joke code

const heartsEl = document.getElementById("hearts");
const scoreEl = document.getElementById("score");
const targetEl = document.getElementById("target");
const barFillEl = document.getElementById("barFill");
const unlockEl = document.getElementById("unlock");
const appEl = document.getElementById("app");

const resetBtn = document.getElementById("resetBtn");
const shareBtn = document.getElementById("shareBtn");
const codeBtn = document.getElementById("codeBtn");
const codeInput = document.getElementById("code");
const codeResult = document.getElementById("codeResult");
const confettiBtn = document.getElementById("confettiBtn");

targetEl.textContent = String(TARGET);

let score = 0;
let lastClickTs = 0;
let combo = 0;

function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }

function updateUI(){
  scoreEl.textContent = String(score);
  const pct = (score / TARGET) * 100;
  barFillEl.style.width = `${clamp(pct, 0, 100)}%`;

  const bar = document.querySelector(".bar");
  if (bar) bar.setAttribute("aria-valuenow", String(score));

  if (score >= TARGET){
    unlockEl.hidden = false;
    // Gentle scroll into view on unlock
    unlockEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function makeHeart(i){
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "heart";
  btn.setAttribute("aria-label", `Heart ${i+1}`);
  btn.innerHTML = `💖<span class="pop">+1</span>`;

  btn.addEventListener("click", () => {
    const now = Date.now();
    const dt = now - lastClickTs;

    // combo mechanic: fast clicks increase points a bit
    if (dt < 550) combo = clamp(combo + 1, 0, 6);
    else combo = 0;

    lastClickTs = now;

    const points = 1 + (combo >= 3 ? 1 : 0); // +1 bonus after 3-combo
    score = clamp(score + points, 0, TARGET);

    btn.classList.remove("popped");
    // re-trigger animation-ish state
    void btn.offsetWidth;
    btn.classList.add("popped");

    const pop = btn.querySelector(".pop");
    if (pop) pop.textContent = `+${points}`;

    updateUI();
  });

  return btn;
}

function buildGrid(){
  heartsEl.innerHTML = "";
  for (let i = 0; i < 12; i++){
    heartsEl.appendChild(makeHeart(i));
  }
}

function reset(){
  score = 0;
  combo = 0;
  lastClickTs = 0;
  unlockEl.hidden = true;
  codeResult.textContent = "";
  codeInput.value = "";
  updateUI();
}

async function copyLink(){
  const url = window.location.href;
  try{
    await navigator.clipboard.writeText(url);
    shareBtn.textContent = "Copied!";
    setTimeout(() => (shareBtn.textContent = "Copy link"), 1200);
  }catch{
    // fallback
    prompt("Copy this link:", url);
  }
}

function checkCode(){
  const attempt = (codeInput.value || "").trim().toLowerCase();
  if (!attempt){
    codeResult.textContent = "Enter something, you menace 😄";
    return;
  }
  if (attempt === SECRET_CODE.toLowerCase()){
    codeResult.innerHTML = "Correct ✅ You found the secret level: <strong>Unlimited cuddles</strong>.";
    // a tiny reward
    burstConfetti(90);
  } else {
    codeResult.textContent = "Nope — but I respect the confidence.";
  }
}

function burstConfetti(n = 70){
  // Super simple confetti: flying emoji particles
  for (let i = 0; i < n; i++){
    const p = document.createElement("div");
    p.textContent = Math.random() < 0.5 ? "💖" : "✨";
    p.style.position = "fixed";
    p.style.left = `${Math.random() * 100}vw`;
    p.style.top = `-20px`;
    p.style.fontSize = `${12 + Math.random() * 18}px`;
    p.style.pointerEvents = "none";
    p.style.filter = "drop-shadow(0 10px 10px rgba(0,0,0,.35))";
    p.style.zIndex = "9999";

    const drift = (Math.random() - 0.5) * 220;
    const fall = 700 + Math.random() * 900;
    const spin = (Math.random() - 0.5) * 720;

    document.body.appendChild(p);

    p.animate(
      [
        { transform: `translate(0px, 0px) rotate(0deg)`, opacity: 1 },
        { transform: `translate(${drift}px, ${fall}px) rotate(${spin}deg)`, opacity: 0.9 },
        { transform: `translate(${drift * 1.2}px, ${fall + 300}px) rotate(${spin * 1.4}deg)`, opacity: 0 }
      ],
      { duration: 1400 + Math.random() * 800, easing: "cubic-bezier(.2,.8,.2,1)" }
    ).onfinish = () => p.remove();
  }
}

// init
buildGrid();
reset();
updateUI();

// wire up buttons
resetBtn.addEventListener("click", reset);
shareBtn.addEventListener("click", copyLink);
codeBtn.addEventListener("click", checkCode);
codeInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkCode();
});
confettiBtn.addEventListener("click", () => burstConfetti(120));
