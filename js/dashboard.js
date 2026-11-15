const grid = document.getElementById("reelGrid");

async function loadDashboard() {
  grid.innerHTML = '<p class="muted">Memuat cerita...</p>';

  const { data, error } = await db
    .from("stories")
    .select("id,title,content,creator_name,created_at,user_id")
    .order("created_at", { ascending: false });

  if (error) {
    grid.innerHTML = '<p class="muted">Gagal memuat cerita: ' +
      error.message + '</p>';
    return;
  }

  if (!data || !data.length) {
    grid.innerHTML = '<p class="muted">Belum ada cerita. Jadilah kreator pertama!</p>';
    return;
  }

  grid.innerHTML = "";

  data.forEach(story => {
    const card = document.createElement("a");
    card.className = "reel-card";
    card.href = "reel.html?id=" + encodeURIComponent(story.id);

    const title = document.createElement("h3");
    title.textContent = story.title || "Tanpa judul";

    const content = document.createElement("p");
    content.textContent = (story.content || "").slice(0, 130);

    const author = document.createElement("small");
    author.textContent = "@" + (story.creator_name || "StoryBot");

    card.append(title, content, author);
    grid.appendChild(card);
  });
}

loadDashboard();
