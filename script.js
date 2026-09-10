const form = document.getElementById("reactionForm");
const urlInput = document.getElementById("url");
const reactionInput = document.getElementById("reaction");
const submitBtn = document.getElementById("submitBtn");
const statusBox = document.getElementById("status");

const LIMIT_KEY = "denn_reaction_last";
const LIMIT_MS = 24 * 60 * 60 * 1000;

function showStatus(message, type = "") {
  statusBox.textContent = message;
  statusBox.className = `status ${type}`.trim();
}

function getRemaining() {
  const last = Number(localStorage.getItem(LIMIT_KEY) || 0);
  if (!last) return 0;
  return Math.max(0, LIMIT_MS - (Date.now() - last));
}

function formatRemaining(ms) {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  return `${hours} jam ${minutes} menit`;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const remaining = getRemaining();
  if (remaining > 0) {
    showStatus(`Limit harian sudah digunakan. Coba lagi dalam ${formatRemaining(remaining)}.`, "error");
    return;
  }

  const url = urlInput.value.trim();
  const reaction = reactionInput.value.trim();

  if (!url || !reaction) {
    showStatus("Link pesan dan emoji wajib diisi.", "error");
    return;
  }

  if (!/^https?:\/\//i.test(url)) {
    showStatus("Masukkan link WhatsApp yang valid.", "error");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Mengirim...";

  try {
    const response = await fetch("/api/reaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, reaction })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || data.error || `Server error (${response.status})`);
    }

    localStorage.setItem(LIMIT_KEY, String(Date.now()));
    showStatus(data.message || "Reaction berhasil dikirim.", "success");
  } catch (error) {
    showStatus(error.message || "Gagal menghubungi server.", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Kirim Sekarang";
  }
});
