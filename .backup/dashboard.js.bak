const grid = document.getElementById("reelGrid");

let stories = [];
let current = 0;
let touchStart = 0;
let touchEnd = 0;

// ====== STATE AUTO-REVEAL ======
let sentences = [];
let revealedCount = 0;
let revealTimer = null;
let progressRAF = null;
let sentenceStartTime = 0;
let isPaused = false;
const SENTENCE_DURATION = 5000;

let contentEl, progressFillEl;

async function loadDashboard() {
  const { data, error } = await db
    .from("stories")
    .select("id,title,content,creator_name,created_at,user_id")
    .order("created_at", { ascending: false });

  if (error) {
    grid.innerHTML = '<div class="empty-feed">Gagal memuat feed: ' +
      error.message + '</div>';
    return;
  }

  stories = data || [];

  if (!stories.length) {
    grid.innerHTML = `
      <div class="empty-feed">
        <div>
          <h2>Belum ada cerita 🌍</h2>
          <p>Jadilah kreator pertama di StoryReels.</p>
          <a href="profile.html" style="color:#ff6687">Buat cerita ↗</a>
        </div>
      </div>`;
    return;
  }

  const requestedId = new URLSearchParams(location.search).get("id");
  const requestedIndex = stories.findIndex(s => s.id === requestedId);
  current = requestedIndex >= 0 ? requestedIndex : 0;

  renderStory();
}

function splitSentences(text) {
  if (!text) return ["Cerita ini belum memiliki isi."];
  const raw = text
    .replace(/\r/g, "")
    .split(/(?<=[.!?…])\s+|\n+/)
    .map(s => s.trim())
    .filter(Boolean);
  return raw.length ? raw : [text.trim()];
}

function renderStory() {
  const story = stories[current];
  if (!story) return;

  stopReveal();

  sentences = splitSentences(story.content);
  revealedCount = 0;
  isPaused = false;

  const item = document.createElement("section");
  item.className = "feed-item";

  const progressBarEl = document.createElement("div");
  progressBarEl.className = "progress-bar";
  progressFillEl = document.createElement("div");
  progressFillEl.className = "progress-fill";
  progressBarEl.appendChild(progressFillEl);

  contentEl = document.createElement("div");
  contentEl.className = "story-content";
  contentEl.textContent = "";

  const info = document.createElement("div");
  info.className = "story-info";

  const title = document.createElement("div");
  title.className = "story-title";
  title.textContent = story.title || "Tanpa judul";

  const author = document.createElement("div");
  author.className = "story-author";
  author.textContent = "@" + (story.creator_name || "StoryBot");

  const desc = document.createElement("div");
  desc.className = "story-desc";
  desc.textContent = "Cerita publik • StoryReels";

  info.append(title, author, desc);

  const actions = document.createElement("div");
  actions.className = "feed-actions";
  actions.innerHTML = `
    <a href="reel.html?id=${encodeURIComponent(story.id)}">
      <span>💬</span>Komentar
    </a>
    <a href="profile.html">
      <span>👤</span>Profil
    </a>
  `;

  const counter = document.createElement("div");
  counter.className = "feed-counter";
  counter.textContent = `${current + 1} / ${stories.length}`;

  const hint = document.createElement("div");
  hint.className = "hint";
  hint.textContent = "SWIPE UNTUK CERITA BERIKUTNYA ↑";

  item.append(progressBarEl, contentEl, info, actions, counter, hint);
  grid.replaceChildren(item);

  history.replaceState(null, "", "dashboard.html?id=" +
    encodeURIComponent(story.id));

  startSentenceReveal();
}

function startSentenceReveal() {
  if (revealedCount >= sentences.length) {
    stopReveal();
    return;
  }

  const sentence = sentences[revealedCount];
  revealedCount++;

  if (contentEl.textContent) contentEl.textContent += " ";
  contentEl.textContent += sentence;
  contentEl.scrollTop = contentEl.scrollHeight;

  startProgressBar();

  revealTimer = setTimeout(() => {
    startSentenceReveal();
  }, SENTENCE_DURATION);
}

function startProgressBar() {
  cancelAnimationFrame(progressRAF);
  progressFillEl.style.width = "0%";
  sentenceStartTime = performance.now();

  const animate = (now) => {
    if (isPaused) {
      sentenceStartTime = now;
      progressRAF = requestAnimationFrame(animate);
      return;
    }
    const elapsed = now - sentenceStartTime;
    const pct = Math.min(100, (elapsed / SENTENCE_DURATION) * 100);
    progressFillEl.style.width = pct + "%";
    if (pct < 100 && revealedCount <= sentences.length) {
      progressRAF = requestAnimationFrame(animate);
    }
  };
  progressRAF = requestAnimationFrame(animate);
}

function stopReveal() {
  clearTimeout(revealTimer);
  revealTimer = null;
  cancelAnimationFrame(progressRAF);
  progressRAF = null;
}

function pauseReveal() {
  if (isPaused) return;
  isPaused = true;
  clearTimeout(revealTimer);
  revealTimer = null;
}

function resumeReveal() {
  if (!isPaused) return;
  isPaused = false;
  const elapsed = performance.now() - sentenceStartTime;
  const remaining = Math.max(0, SENTENCE_DURATION - elapsed);
  revealTimer = setTimeout(() => {
    startSentenceReveal();
  }, remaining);
  sentenceStartTime = performance.now();
  progressRAF = requestAnimationFrame(function step(now) {
    const e = now - sentenceStartTime;
    const pct = Math.min(100, (e / SENTENCE_DURATION) * 100);
    progressFillEl.style.width = pct + "%";
    if (pct < 100) progressRAF = requestAnimationFrame(step);
  });
}

function nextStory() {
  if (current < stories.length - 1) {
    current++;
    renderStory();
  }
}

function previousStory() {
  if (current > 0) {
    current--;
    renderStory();
  }
}

grid.addEventListener("touchstart", e => {
  touchStart = e.changedTouches[0].clientY;
  pauseReveal();
}, { passive: true });

grid.addEventListener("touchend", e => {
  touchEnd = e.changedTouches[0].clientY;
  const distance = touchStart - touchEnd;

  if (Math.abs(distance) < 55) {
    resumeReveal();
    return;
  }

  stopReveal();
  if (distance > 0) nextStory();
  else previousStory();
}, { passive: true });

document.addEventListener("keydown", e => {
  if (e.key === "ArrowDown") { stopReveal(); nextStory(); }
  if (e.key === "ArrowUp") { stopReveal(); previousStory(); }
  if (e.key === " ") { e.preventDefault(); isPaused ? resumeReveal() : pauseReveal(); }
});

grid.addEventListener("click", e => {
  if (e.target.closest("a")) return;
  isPaused ? resumeReveal() : pauseReveal();
});

loadDashboard();
