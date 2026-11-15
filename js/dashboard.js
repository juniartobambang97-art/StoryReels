const grid = document.getElementById("reelGrid");

let stories = [];
let current = 0;
let touchStart = 0;
let touchEnd = 0;

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

function renderStory() {
  const story = stories[current];
  if (!story) return;

  const content = document.createElement("div");
  content.className = "story-content";
  content.textContent = story.content || "Cerita ini belum memiliki isi.";

  const item = document.createElement("section");
  item.className = "feed-item";

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

  item.append(content, info, actions, counter, hint);
  grid.replaceChildren(item);

  history.replaceState(null, "", "dashboard.html?id=" +
    encodeURIComponent(story.id));
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
}, { passive: true });

grid.addEventListener("touchend", e => {
  touchEnd = e.changedTouches[0].clientY;
  const distance = touchStart - touchEnd;

  if (Math.abs(distance) < 55) return;

  if (distance > 0) nextStory();
  else previousStory();
}, { passive: true });

document.addEventListener("keydown", e => {
  if (e.key === "ArrowDown") nextStory();
  if (e.key === "ArrowUp") previousStory();
});

loadDashboard();
