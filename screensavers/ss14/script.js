const CODE_LENGTH = 6;
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I ambiguity
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
  const text = document.getElementById("status-text");
  text.textContent = isOnline ? "Player is online" : "Player is offline";
}

const pairingCode = generateCode();
document.getElementById("pairing-code").textContent = pairingCode;
updateQrCode(pairingCode);
updateTimestamp();
setStatus(true);

setInterval(updateTimestamp, 1000 * 30);
