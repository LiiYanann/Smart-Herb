const lines = [
  "Welcome! I am Smarty, your digital herbal guide for U.S. consumers.",
  "This saffron herbal tea has passed the selected U.S. consumer-facing safety checks.",
  "Pesticide residues were not detected, and key heavy-metal indicators are within reviewed limits.",
  "You can download the full A4 digital quality passport for clear safety and traceability details.",
  "This is a quality and compliance explanation, not medical advice. Please consult a professional if you are pregnant, allergic, or taking medication."
];

let index = 0;
let voices = [];
let speakingTimer = null;
const typewriter = document.getElementById("typewriter");
const statusText = document.getElementById("statusText");
const mouth = document.getElementById("mouth");
const speakBtn = document.getElementById("speakBtn");
const pauseBtn = document.getElementById("pauseBtn");
const nextBtn = document.getElementById("nextBtn");
const avatarImg = document.getElementById("avatarImg");

avatarImg.addEventListener("error", () => {
  avatarImg.style.display = "none";
  const stage = document.querySelector(".avatar-stage");
  const fallback = document.createElement("div");
  fallback.style.cssText = "position:relative;z-index:4;width:190px;height:190px;border-radius:50%;display:grid;place-items:center;font-size:84px;background:linear-gradient(135deg,#fff1b7,#b8eca5);box-shadow:0 24px 50px rgba(58,105,46,.22)";
  fallback.textContent = "🌿";
  stage.appendChild(fallback);
});

function loadVoices() {
  voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
}
loadVoices();
if (window.speechSynthesis) speechSynthesis.onvoiceschanged = loadVoices;

function pickVoice() {
  const preferred = [
    "Microsoft Jenny", "Microsoft Aria", "Google US English", "Google UK English Female",
    "Samantha", "Karen", "Moira", "English United States"
  ];
  for (const key of preferred) {
    const found = voices.find(v => v.name.includes(key));
    if (found) return found;
  }
  return voices.find(v => /en[-_]US/i.test(v.lang)) || voices.find(v => /^en/i.test(v.lang)) || voices[0];
}

function typeLine(text) {
  typewriter.textContent = "";
  let i = 0;
  const timer = setInterval(() => {
    typewriter.textContent += text[i] || "";
    i++;
    if (i > text.length) clearInterval(timer);
  }, 22);
}

function setSpeaking(active) {
  document.body.classList.toggle("speaking", active);
  statusText.textContent = active ? "Smarty is speaking naturally" : "Smarty is ready to explain";
  clearInterval(speakingTimer);
  mouth.classList.remove("talking");
  if (active) {
    speakingTimer = setInterval(() => mouth.classList.toggle("talking"), 145);
  }
}

function speakCurrent() {
  if (!window.speechSynthesis) return;
  speechSynthesis.cancel();
  const text = lines[index];
  typeLine(text);
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickVoice();
  if (voice) utterance.voice = voice;
  utterance.lang = voice?.lang || "en-US";
  utterance.rate = 0.88;
  utterance.pitch = 1.04;
  utterance.volume = 1;
  utterance.onstart = () => setSpeaking(true);
  utterance.onend = () => setSpeaking(false);
  utterance.onerror = () => setSpeaking(false);
  speechSynthesis.speak(utterance);
}

speakBtn.addEventListener("click", speakCurrent);
pauseBtn.addEventListener("click", () => {
  if (!window.speechSynthesis) return;
  speechSynthesis.cancel();
  setSpeaking(false);
});
nextBtn.addEventListener("click", () => {
  index = (index + 1) % lines.length;
  speakCurrent();
});

setTimeout(() => typeLine(lines[0]), 500);
