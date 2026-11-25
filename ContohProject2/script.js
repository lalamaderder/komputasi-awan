const video = document.getElementById("video");
const overlay = document.getElementById("overlay");
const cameraView = document.getElementById("cameraView");

const startButton = document.getElementById("startCamera");
const scanButton = document.getElementById("scanButton");
const stopButton = document.getElementById("stopCamera");

const placeholder = document.getElementById("placeholder");
const cameraStatus = document.getElementById("cameraStatus");
const scanMessage = document.getElementById("scanMessage");

let stream = null;

startButton.addEventListener("click", async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false
    });

    video.srcObject = stream;
    await video.play();

    placeholder.style.display = "none";
    cameraStatus.textContent = "Kamera aktif";
    scanMessage.textContent =
      "Kamera berhasil diaktifkan. Posisikan wajah di tengah.";

    startButton.disabled = true;
    scanButton.disabled = false;
    stopButton.disabled = false;
  } catch (error) {
    scanMessage.textContent =
      "Kamera tidak bisa dibuka. Izinkan akses kamera di browser dan coba lagi.";
    console.error(error);
  }
});

scanButton.addEventListener("click", () => {
  if (!video.videoWidth || !video.videoHeight) {
    scanMessage.textContent = "Tunggu sampai gambar kamera muncul.";
    return;
  }

  overlay.width = video.videoWidth;
  overlay.height = video.videoHeight;

  const context = overlay.getContext("2d");
  context.clearRect(0, 0, overlay.width, overlay.height);

  const centerX = overlay.width / 2;
  const centerY = overlay.height / 2;

  // Bingkai oval sebagai panduan posisi wajah.
  context.strokeStyle = "#F4C5DE";
  context.lineWidth = 3;
  context.beginPath();
  context.ellipse(
    centerX,
    centerY,
    overlay.width * 0.23,
    overlay.height * 0.36,
    0,
    0,
    Math.PI * 2
  );
  context.stroke();

  scanMessage.textContent =
    "Panduan wajah muncul. Ini belum mendeteksi landmark wajah atau menganalisis warna kulit.";
});

stopButton.addEventListener("click", () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }

  video.srcObject = null;
  overlay.getContext("2d").clearRect(
    0, 0, overlay.width, overlay.height
  );

  placeholder.style.display = "flex";
  cameraStatus.textContent = "Kamera belum aktif";
  scanMessage.textContent = "Kamera sudah dimatikan.";

  startButton.disabled = false;
  scanButton.disabled = true;
  stopButton.disabled = true;
});