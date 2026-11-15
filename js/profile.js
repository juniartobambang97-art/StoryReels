const profileContent = document.getElementById("profileContent");
const profileReels = document.getElementById("profileReels");

const params = new URLSearchParams(location.search);
let profileId = params.get("id");
let currentUser = null;

const el = (tag, text = "", className = "") => {
  const node = document.createElement(tag);
  node.textContent = text;
  if (className) node.className = className;
  return node;
};

async function loadProfile() {
  profileContent.textContent = "Memuat profil...";
  profileReels.replaceChildren();

  const { data: auth } = await db.auth.getUser();
  currentUser = auth.user;

  if (!profileId && currentUser) profileId = currentUser.id;

  if (!profileId) {
    profileContent.textContent = "Profil tidak ditemukan.";
    return;
  }

  const { data: profile, error } = await db
    .from("profiles")
    .select("*")
    .eq("id", profileId)
    .maybeSingle();

  if (error || !profile) {
    profileContent.textContent = "Profil belum tersedia.";
    return;
  }

  const { data: stories, error: storyError } = await db
    .from("stories")
    .select("id,title,content,created_at")
    .eq("user_id", profileId)
    .order("created_at", { ascending: false });

  if (storyError) {
    profileContent.textContent = storyError.message;
    return;
  }

  const own = currentUser?.id === profileId;

  // Identitas kreator
  const shell = el("section", "", "creator-profile");

  const cover = el("div", "", "profile-cover");

  const avatar = el(
    "div",
    (profile.display_name || profile.username || "?")
      .charAt(0).toUpperCase(),
    "profile-avatar"
  );

  const identity = el("div", "", "profile-identity");
  identity.append(
    el("h1", profile.display_name || "Kreator"),
    el("div", "@" + profile.username, "profile-username"),
    el("p", profile.bio || "Belum ada bio. Dunia masih menunggu ceritamu.", "profile-bio")
  );

  cover.append(avatar);
  shell.append(cover, identity);

  // Statistik
  const stats = el("div", "", "profile-stats");

  const stat = (number, label) => {
    const item = el("div", "", "profile-stat");
    item.append(
      el("strong", String(number)),
      el("span", label)
    );
    return item;
  };

  stats.append(
    stat(stories.length, "REELS"),
    stat("—", "ANAK"),
    stat("—", "AYAH"),
    stat("—", "IBU"),
    stat("—", "ZIGOT ♥")
  );

  // Anak, Ayah, Ibu dan Zigot menunggu sistem relasi/reaction.
  shell.appendChild(stats);

  const actions = el("div", "", "profile-actions");

  if (own) {
    const edit = el("button", "EDIT PROFIL");
    edit.className = "primary";

    edit.onclick = async () => {
      const name = prompt("Nama tampilan:", profile.display_name || "");
      if (name === null) return;
      if (!name.trim()) return alert("Nama tidak boleh kosong.");

      const bio = prompt("Bio kreator:", profile.bio || "");
      if (bio === null) return;

      const { error } = await db.from("profiles")
        .update({
          display_name: name.trim(),
          bio: bio.trim()
        })
        .eq("id", currentUser.id);

      if (error) alert(error.message);
      else loadProfile();
    };

    actions.appendChild(edit);
  }

  const share = el("button", "SALIN TAUTAN ↗");
  share.onclick = async () => {
    const url = location.origin + "/profile.html?id=" +
      encodeURIComponent(profileId);

    try {
      await navigator.clipboard.writeText(url);
      alert("Tautan profil berhasil disalin!");
    } catch {
      prompt("Salin tautan profil:", url);
    }
  };

  actions.appendChild(share);
  shell.appendChild(actions);

  profileContent.replaceChildren(shell);

  // Koleksi cerita
  profileReels.replaceChildren();

  if (!stories.length) {
    profileReels.appendChild(
      el("p", "Belum ada cerita. Kreator ini masih menyimpan rahasia. 🤣", "muted")
    );
    return;
  }

  stories.forEach(story => {
    const card = el("article", "", "reel-card");

    card.append(
      el("div", "STORYREELS / CERITA", "muted"),
      el("h3", story.title || "Tanpa judul"),
      el("p", (story.content || "").slice(0, 180) +
        ((story.content || "").length > 180 ? "..." : ""))
    );

    const actions = el("div", "", "profile-card-actions");

    const open = el("a", "▶ BACA CERITA");
    open.href = "reel.html?id=" + encodeURIComponent(story.id);
    actions.appendChild(open);

    if (own) {
      const edit = el("button", "EDIT");

      edit.onclick = async () => {
        const title = prompt("Judul baru:", story.title || "");
        if (title === null) return;
        if (!title.trim()) return alert("Judul tidak boleh kosong.");

        const content = prompt("Isi cerita:", story.content || "");
        if (content === null) return;
        if (!content.trim()) return alert("Cerita tidak boleh kosong.");

        const { error } = await db.from("stories")
          .update({
            title: title.trim(),
            content: content.trim()
          })
          .eq("id", story.id)
          .eq("user_id", currentUser.id);

        if (error) alert(error.message);
        else loadProfile();
      };

      const remove = el("button", "HAPUS");

      remove.onclick = async () => {
        if (!confirm("Yakin hapus cerita ini?")) return;

        const { error } = await db.from("stories")
          .delete()
          .eq("id", story.id)
          .eq("user_id", currentUser.id);

        if (error) alert(error.message);
        else loadProfile();
      };

      actions.append(edit, remove);
    }

    card.appendChild(actions);
    profileReels.appendChild(card);
  });
}

loadProfile();
