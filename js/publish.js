(() => {
  let currentStory = null;
  let savedStoryId = null;

  const $ = id => document.getElementById(id);

  function setPublishVisible(visible) {
    const button = $("publishButton");
    if (button) button.style.display = visible ? "block" : "none";
  }

  // Dipanggil setelah cerita berhasil dibuat oleh mesin Reels.
  const originalStart = window.startNewReel;

  if (typeof originalStart !== "function") {
    console.error("startNewReel tidak ditemukan.");
    return;
  }

  window.startNewReel = function () {
    const title = $("newTitle")?.value.trim();
    const description = $("newDescription")?.value.trim();
    const content = $("newStory")?.value.trim();

    originalStart();

    if (!title || !content) return;

    currentStory = { title, description, content };
    savedStoryId = null;
    setPublishVisible(true);

    const button = $("publishButton");
    if (button) button.textContent = "PUBLISH ↑";
  };

  window.publishReel = async function () {
    const button = $("publishButton");

    if (!currentStory) {
      alert("Buat cerita dulu bre!");
      return;
    }

    if (savedStoryId) {
      alert("Cerita ini sudah dipublikasikan!");
      return;
    }

    if (typeof db === "undefined") {
      alert("Koneksi Supabase belum tersedia.");
      return;
    }

    button.disabled = true;
    button.textContent = "MENYIMPAN...";

    try {
      const { data: authData, error: authError } =
        await db.auth.getUser();

      if (authError) throw authError;

      const user = authData.user;

      if (!user) {
        alert("Login dulu sebelum publish bre!");
        if (typeof window.openAuthModal === "function") {
          window.openAuthModal();
        }
        return;
      }

      let { data: profile, error: profileError } = await db
        .from("profiles")
        .select("id,username,display_name")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profile) {
        const base = (user.email || "kreator")
          .split("@")[0]
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, "")
          .slice(0, 20) || "kreator";

        const username = base + "_" + user.id.slice(0, 6);

        const { data, error } = await db
          .from("profiles")
          .insert({
            id: user.id,
            username,
            display_name: base
          })
          .select()
          .single();

        if (error) throw error;
        profile = data;
      }

      const { data: story, error: storyError } = await db
        .from("stories")
        .insert({
          title: currentStory.title,
          content: currentStory.content,
          creator_name: profile.display_name || profile.username,
          creator_type: "user",
          user_id: user.id
        })
        .select("id")
        .single();

      if (storyError) throw storyError;

      savedStoryId = story.id;
      button.textContent = "TERSIMPAN ✓";
      alert("Cerita berhasil dipublikasikan bre! 🤣");

    } catch (error) {
      console.error("Publish error:", error);
      alert("Gagal publish: " + (error.message || "Kesalahan tidak diketahui"));
      button.textContent = "COBA LAGI ↑";
    } finally {
      button.disabled = false;
    }
  };
})();
