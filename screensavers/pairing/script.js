// Pairing code is issued by the backend (see cronjob/workflow note) — this
// placeholder just simulates it refreshing periodically for the demo.
const CODE_LENGTH = 6;
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I ambiguity

// TODO: replace with the real pairing deep link once the dashboard route exists.
const PAIRING_URL_BASE = "https://dashboard.ntv360.com/pair";

function generateCode() {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

function updateQrCode(code) {
  const pairingUrl = `${PAIRING_URL_BASE}?code=${code}`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=0&data=${encodeURIComponent(pairingUrl)}`;
  document.getElementById("pairing-qr").src = qrApiUrl;
}

function updateTimestamp() {
  const now = new Date();
  const formatted = now.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  document.getElementById("pairing-timestamp").textContent = formatted.replace(" at ", " · ");
}

function setStatus(isOnline) {
  const dot = document.getElementById("status-dot");
  const text = document.getElementById("status-text");
  dot.classList.toggle("status__dot--online", isOnline);
  dot.classList.toggle("status__dot--offline", !isOnline);
  text.textContent = isOnline ? "PLAYER IS ONLINE" : "PLAYER IS OFFLINE";
}

const pairingCode = generateCode();
document.getElementById("pairing-code").textContent = pairingCode;
updateQrCode(pairingCode);
updateTimestamp();
setStatus(true);

setInterval(updateTimestamp, 1000 * 30);

const stepsList = document.getElementById("steps");
const stepsToggle = document.getElementById("steps-toggle");

stepsToggle.addEventListener("click", () => {
  const isHidden = stepsList.hasAttribute("hidden");
  stepsList.toggleAttribute("hidden", !isHidden);
  stepsToggle.textContent = isHidden ? "Hide steps" : "Show steps";
});
