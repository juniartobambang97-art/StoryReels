const uploadButton = document.getElementById("uploadButton");
const resultBox = document.getElementById("result");

uploadButton.onclick = async () => {
  uploadButton.disabled = true;

  try {
    resultBox.textContent = "Memeriksa akun...";

    const { data: auth, error: authError } = await db.auth.getUser();
    if (authError) throw authError;

    const user = auth.user;
    if (!user) throw new Error("Belum login.");

    const raw = document.getElementById("storyInput").value;

    const regex =
      /(?:^|\n)\s*(?:Serial:\s*(.*?)\s*\n)?(?:Episode:\s*(.*?)\s*\n)?Judul:\s*(.*?)\s*\nCerita:\s*([\s\S]*?)(?=\n\s*(?:Serial:\s*|Judul:\s*)|$)/g;

    const parsed = [...raw.matchAll(regex)].map(match => ({
      series_title: (match[1] || "").trim() || null,
      episode_number: match[2] ? Number(match[2]) : null,
      title: match[3].trim(),
      content: match[4].trim()
    })).filter(x => x.title && x.content);

    if (!parsed.length) {
      throw new Error("Format cerita tidak terbaca.");
    }

    if (parsed.length > 100) {
      throw new Error("Maksimal 100 cerita per batch.");
    }

    for (const story of parsed) {
      if (
        story.episode_number !== null &&
        (!Number.isInteger(story.episode_number) ||
         story.episode_number < 1)
      ) {
        throw new Error("Nomor episode harus bilangan bulat positif.");
      }
    }

    resultBox.textContent = "Memastikan profil kreator...";

    let { data: profile, error: profileError } = await db
      .from("profiles")
      .select("id,username,display_name")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) throw profileError;

    if (!profile) {
      const base = (user.email || "kreator")
        .split("@")[0].toLowerCase()
        .replace(/[^a-z0-9_]/g, "")
        .slice(0, 20) || "kreator";

      const { data, error } = await db
        .from("profiles")
        .insert({
          id: user.id,
          username: base + "_" + user.id.slice(0, 6),
          display_name: base
        })
        .select()
        .single();

      if (error) throw error;
      profile = data;
    }

    resultBox.textContent = "Memeriksa serial dan episode...";

    const { data: existing, error: existingError } = await db
      .from("stories")
      .select("title,series_title,episode_number")
      .eq("user_id", user.id);

    if (existingError) throw existingError;

    const knownTitles = new Set(
      (existing || []).map(x => (x.title || "").trim().toLowerCase())
    );

    const maxEpisodes = new Map();

    for (const item of existing || []) {
      if (!item.series_title) continue;

      const key = item.series_title.trim().toLowerCase();
      maxEpisodes.set(
        key,
        Math.max(maxEpisodes.get(key) || 0, item.episode_number || 0)
      );
    }

    const usedEpisodes = new Set(
      (existing || [])
        .filter(x => x.series_title && x.episode_number)
        .map(x =>
          x.series_title.trim().toLowerCase() + "::" + x.episode_number
        )
    );

    const fresh = [];
    let skipped = 0;

    for (const story of parsed) {
      const titleKey = story.title.toLowerCase();

      if (knownTitles.has(titleKey)) {
        skipped++;
        continue;
      }

      if (story.series_title) {
        const key = story.series_title.toLowerCase();

        if (story.episode_number === null) {
          story.episode_number = (maxEpisodes.get(key) || 0) + 1;
        }

        const episodeKey = key + "::" + story.episode_number;

        if (usedEpisodes.has(episodeKey)) {
          throw new Error(
            "Episode " + story.episode_number +
            " serial \"" + story.series_title + "\" sudah ada."
          );
        }

        usedEpisodes.add(episodeKey);
        maxEpisodes.set(
          key,
          Math.max(maxEpisodes.get(key) || 0, story.episode_number)
        );
      }

      knownTitles.add(titleKey);
      fresh.push(story);
    }

    if (!fresh.length) {
      resultBox.textContent =
        "Semua judul sudah ada. Tidak ada cerita baru yang diupload.";
      return;
    }

    const rows = fresh.map(story => ({
      title: story.title,
      content: story.content,
      series_title: story.series_title,
      episode_number: story.episode_number,
      creator_name: profile.display_name || profile.username,
      creator_type: "user",
      user_id: user.id
    }));

    resultBox.textContent = "Mengupload " + rows.length + " cerita...";

    const { error: insertError } = await db
      .from("stories")
      .insert(rows);

    if (insertError) throw insertError;

    resultBox.textContent =
      "BERHASIL! 🎉\n\n" +
      rows.length + " cerita berhasil diupload." +
      "\nDuplikat dilewati: " + skipped +
      "\n\n" +
      rows.map(x =>
        x.series_title
          ? x.series_title + " — Episode " + x.episode_number
          : x.title + " — Cerita biasa"
      ).join("\n") +
      "\n\nBuka StoryReels untuk melihat hasilnya.";

  } catch (error) {
    console.error(error);
    resultBox.textContent = "GAGAL: " + error.message;
  } finally {
    uploadButton.disabled = false;
  }
};
