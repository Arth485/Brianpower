const loginForm = document.getElementById("login-form");
const uploadSection = document.getElementById("upload-section");
const uploadButton = document.getElementById("upload-button");
const videoFile = document.getElementById("video-file");
const videosList = document.getElementById("videos-list");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { user, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert("Erro ao logar: " + error.message);
  } else {
    loginForm.classList.add("hidden");
    uploadSection.classList.remove("hidden");
    loadVideos();
  }
});

uploadButton.addEventListener("click", async () => {
  const file = videoFile.files[0];
  if (!file) return alert("Escolha um vídeo");

  const { data, error } = await supabase.storage
    .from("videos")
    .upload(`public/${file.name}`, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    alert("Erro ao enviar vídeo: " + error.message);
  } else {
    alert("Vídeo enviado com sucesso!");
    loadVideos();
  }
});

async function loadVideos() {
  const { data, error } = await supabase.storage.from("videos").list("public/");
  if (error) return alert("Erro ao carregar vídeos");

  videosList.innerHTML = "";

  for (let video of data) {
    const { data: urlData } = await supabase.storage
      .from("videos")
      .getPublicUrl(`public/${video.name}`);

    const videoEl = document.createElement("video");
    videoEl.controls = true;
    videoEl.src = urlData.publicUrl;

    videosList.appendChild(videoEl);
  }
}
