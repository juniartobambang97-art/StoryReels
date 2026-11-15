const profileContent = document.getElementById("profileContent");
const profileReels = document.getElementById("profileReels");

const params = new URLSearchParams(location.search);
let profileId = params.get("id");

let currentUser = null;

function el(tag, text, className) {
  const node = document.createElement(tag);
  node.textContent = text || "";
  if (className) node.className = className;
  return node;
}

async function loadProfile() {
  const { data: auth } = await db.auth.getUser();
  currentUser = auth.user;

  if (!profileId && currentUser) {
    profileId = currentUser.id;
  }

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

  const ownProfile = currentUser && currentUser.id === profileId;

  const head = document.createElement("div");
  head.className = "profile-head";

  const avatar = el("div",
    (profile.display_name || profile.username || "?").charAt(0).toUpperCase(),
    "avatar");

  const identity = document.createElement("div");
  identity.append(
    el("h2", profile.display_name),
    el("div", "@" + profile.username, "muted"),
    el("p", profile.bio || "Belum ada deskripsi.", "muted")
  );

  head.append(avatar, identity);

  const stats = document.createElement("div");
  stats.className = "stats";

  const stat = (number, label) => {
    const item = document.createElement("div");
    item.append(el("strong", number), el("span", label));
    return item;
  };

  stats.append(
    stat(stories.length, "Reels"),
    stat("0", "Anak"),
    stat("0", "Zigot ♥")
  );

  profileContent.replaceChildren(head, stats);

  if (ownProfile) {
    const editProfile = el("button", "EDIT PROFIL");
    editProfile.className = "primary";

    editProfile.onclick = async () => {
      const name = prompt("Nama tampilan:", profile.display_name || "");
      if (name === null) return;

      const bio = prompt("Bio:", profile.bio || "");
      if (bio === null) return;

      const { error } = await db.from("profiles")
        .update({ display_name: name.trim(), bio: bio.trim() })
        .eq("id", currentUser.id);

      if (error) alert(error.message);
      else loadProfile();
    };

    profileContent.appendChild(editProfile);
  }

  profileReels.replaceChildren();

  if (!stories.length) {
    profileReels.append(el("p", "Belum ada Reels.", "muted"));
    return;
  }

  stories.forEach(story => {
    const card = document.createElement("div");
    card.className = "reel-card";

    card.append(
      el("h3", story.title || "Tanpa judul"),
      el("p", (story.content || "").slice(0, 120))
    );

    const actions = document.createElement("div");

    const open = el("a", "▶ TONTON");
    open.href = "reel.html?id=" + encodeURIComponent(story.id);
    actions.appendChild(open);

    if (ownProfile) {
      const edit = el("button", "EDIT");
      edit.onclick = async () => {
        const title = prompt("Judul baru:", story.title || "");
        if (title === null) return;

        const content = prompt("Isi cerita baru:", story.content || "");
        if (content === null) return;

        const { error } = await db.from("stories")
          .update({ title: title.trim(), content: content.trim() })
          .eq("id", story.id)
          .eq("user_id", currentUser.id);

        if (error) alert(error.message);
        else loadProfile();
      };

      const remove = el("button", "HAPUS");
      remove.onclick = async () => {
        if (!confirm("Hapus Reels ini?")) return;

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
