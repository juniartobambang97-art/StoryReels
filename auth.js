const SUPABASE_URL = "https://hhhkkehriwcdkofututl.supabase.co".replace(" ", "");
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoaGtrZWhyaXdjZGtvZnV0dXRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ2NzY0NzAsImV4cCI6MjExMDI1MjQ3MH0.erjHHk-AdiuxLTFtvlAVzWE670jTj0NbCY5Of5-8JdU";

const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

let authMode = "login";

function openAuthModal() {
  document.getElementById("authModal").style.display = "flex";
}

function closeAuthModal() {
  document.getElementById("authModal").style.display = "none";
}

function setAuthMode(mode) {
  authMode = mode;
  document.getElementById("authTitle").textContent =
    mode === "login" ? "Masuk ke StoryReels" : "Buat akun StoryReels";
  document.getElementById("authSubmit").textContent =
    mode === "login" ? "Masuk" : "Daftar";
  document.getElementById("authSwitch").textContent =
    mode === "login" ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk";
  document.getElementById("authMessage").textContent = "";
}

const authSwitchButton = document.getElementById("authSwitch");

if (authSwitchButton) {
  authSwitchButton.onclick = () => {
    setAuthMode(authMode === "login" ? "signup" : "login");
  };
}

document.getElementById("authForm").onsubmit = async (e) => {
  e.preventDefault();

  const email = document.getElementById("authEmail").value.trim();
  const password = document.getElementById("authPassword").value;
  const message = document.getElementById("authMessage");
  const submit = document.getElementById("authSubmit");

  submit.disabled = true;
  message.textContent = "Memproses...";

  try {
    let result;

    if (authMode === "signup") {
      result = await db.auth.signUp({
        email,
        password
      });
    } else {
      result = await db.auth.signInWithPassword({
        email,
        password
      });
    }

    if (result.error) throw result.error;

    if (authMode === "signup" && !result.data.session) {
      message.textContent = "Cek email untuk verifikasi akun.";
    } else {
      closeAuthModal();
    }
  } catch (error) {
    message.textContent = error.message;
  } finally {
    submit.disabled = false;
  }
};

async function updateAuthUI(session) {
  const button = document.getElementById("authButton");

  if (!button) return;

  if (session) {
    button.textContent = "Keluar";
    button.onclick = async () => {
      await db.auth.signOut();
    };
    button.title = session.user.email;
  } else {
    button.textContent = "Masuk / Daftar";
    button.onclick = openAuthModal;
    button.title = "";
  }
}

db.auth.onAuthStateChange((_event, session) => {
  updateAuthUI(session);
});

db.auth.getSession().then(({ data }) => {
  updateAuthUI(data.session);
});
