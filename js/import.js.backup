const uploadButton = document.getElementById("uploadButton");
const resultBox = document.getElementById("result");

uploadButton.onclick = async () => {
  uploadButton.disabled = true;
  resultBox.textContent = "Memeriksa akun...";

  try {
    const { data: auth, error: authError } = await db.auth.getUser();
    if (authError) throw authError;

    const user = auth.user;
    if (!user) throw new Error("Belum login. Login dulu di StoryReels.");

    const raw = document.getElementById("storyInput").value;
    const regex = /Judul:\s*(.*?)\s*\nCerita:\s*([\s\S]*?)(?=\n\s*Judul:|$)/g;
    const parsed = [...raw.matchAll(regex)].map(match => ({
      title: match[1].trim(),
      content: match[2].trim()
    })).filter(story => story.title && story.content);

    if (!parsed.length) throw new Error("Format cerita tidak terbaca.");
    if (parsed.length > 100) throw new Error("Maksimal 100 cerita per batch.");

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
        .replace(/[^a-z0-9_]/g, "").slice(0, 20) || "kreator";

      const { data, error } = await db.from("profiles").insert({
        id: user.id,
        username: base + "_" + user.id.slice(0, 6),
        display_name: base
      }).select().single();

      if (error) throw error;
      profile = data;
    }

    resultBox.textContent = "Memeriksa cerita yang sudah ada...";

    const { data: existing, error: existingError } = await db
      .from("stories")
      .select("title")
      .eq("user_id", user.id);

    if (existingError) throw existingError;

    const known = new Set((existing || []).map(item =>
      (item.title || "").trim().toLowerCase()
    ));

    const fresh = parsed.filter(story =>
      !known.has(story.title.toLowerCase())
    );

    if (!fresh.length) {
      resultBox.textContent = "Semua judul sudah ada. Tidak ada duplikat yang diupload.";
      return;
    }

    const rows = fresh.map(story => ({
      title: story.title,
      content: story.content,
      creator_name: profile.display_name || profile.username,
      creator_type: "user",
      user_id: user.id
    }));

    resultBox.textContent = "Mengupload " + rows.length + " cerita...";

    const { error: insertError } = await db.from("stories").insert(rows);
    if (insertError) throw insertError;

    resultBox.textContent =
      "BERHASIL! 🎉\n\n" +
      rows.length + " cerita masuk ke akun " +
      (profile.display_name || profile.username) +
      "\n\nTotal cerita dalam batch ini: " + parsed.length +
      "\nDuplikat dilewati: " + (parsed.length - rows.length) +
      "\n\nBuka profil atau dashboard untuk melihat hasilnya.";

  } catch (error) {
    console.error(error);
    resultBox.textContent = "GAGAL: " + error.message;
  } finally {
    uploadButton.disabled = false;
  }
};
