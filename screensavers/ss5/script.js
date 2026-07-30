// Pairing code — placeholder generation, matches the pattern used by the
// other screensavers (backend issues the real code).
const CODE_LENGTH = 6;
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I ambiguity

function generateCode() {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

function renderCode(code) {
  const grid = document.getElementById("code-grid");
  grid.innerHTML = code
    .split("")
    .map((ch, i) => `<div class="code-tile${i === code.length - 1 ? " code-tile--last" : ""}">${ch}</div>`)
    .join("");
}

// Cosmetic QR-look pattern — not a decodable code, just visual texture so
// the tile reads as "a QR code" at a glance.
function renderFakeQr() {
  const box = document.getElementById("qr-box");
  const size = 15;
  let seed = Math.floor(Math.random() * 100000);
  let modules = "";

  function isFinderZone(r, c) {
    return (r < 4 && c < 4) || (r < 4 && c >= size - 4) || (r >= size - 4 && c < 4);
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (isFinderZone(r, c)) continue;
      const value = Math.abs(Math.sin(seed + r * 17 + c * 31));
      if (value > 0.45) {
        modules += `<rect x="${c}" y="${r}" width="0.9" height="0.9" fill="#00263E" />`;
      }
    }
  }

  const finder = (x, y) => `
    <rect x="${x}" y="${y}" width="4" height="4" fill="none" stroke="#00263E" stroke-width="0.8" />
    <rect x="${x + 1.2}" y="${y + 1.2}" width="1.6" height="1.6" fill="#00263E" />
  `;

  box.innerHTML = `
    <svg viewBox="0 0 ${size} ${size}">
      ${finder(0, 0)}
      ${finder(size - 4, 0)}
      ${finder(0, size - 4)}
      ${modules}
    </svg>
  `;
}

function updateClock() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  document.getElementById("today").textContent = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const TOTAL_SECONDS = 300; // 5 minute rotation
let remainingSeconds = TOTAL_SECONDS;

function updateTimer() {
  const mins = Math.floor(remainingSeconds / 60);
  const secs = String(remainingSeconds % 60).padStart(2, "0");
  document.getElementById("timer").textContent = `${mins}:${secs}`;

  if (remainingSeconds <= 0) {
    renderCode(generateCode());
    remainingSeconds = TOTAL_SECONDS;
  } else {
    remainingSeconds--;
  }
}

renderCode(generateCode());
renderFakeQr();
updateClock();
updateTimer();
setInterval(updateClock, 1000);
setInterval(updateTimer, 1000);
