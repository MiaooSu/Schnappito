const WIDTH = 1041, HEIGHT = 1484;

const elements = {
  video: document.getElementById('liveVideo'),
  esquisse: document.getElementById('esquisseFinale'),
  ctx: document.getElementById('esquisseFinale').getContext('2d'),
  takePhotoBtn: document.getElementById('takePhoto'),
  downloadBtn: document.getElementById('downloadBtn'),
  countdown: document.querySelector('.countdown-timer')
};

const moveVideoToFull = () => {
  const { video } = elements;
  video.style.display = 'block';
  video.style.top = '18%';
  video.style.left = '21%';
  video.style.width = '55%';
  video.style.height = '60%';
};

const startCountdown = callback => {
  let count = 3;
  const { countdown } = elements;
  countdown.textContent = count;
  countdown.style.display = 'flex';
  const intervalId = setInterval(() => {
    count--;
    if (count > 0) countdown.textContent = count;
    else {
      clearInterval(intervalId);
      countdown.style.display = 'none';
      callback();
    }
  }, 1000);
};

const capturePhoto = () => {
  const { video, ctx, takePhotoBtn } = elements;
  const vW = video.videoWidth, vH = video.videoHeight;

  const photoX = WIDTH * 0.21;
  const photoY = HEIGHT * 0.18;
  const photoW = WIDTH * 0.55;
  const photoH = HEIGHT * 0.60;

  const targetAspect = WIDTH / HEIGHT;
  const vAspect = vW / vH;
  let sx, sy, sw, sh;

  if (vAspect > targetAspect) { 
    sh = vH; 
    sw = vH * targetAspect; 
    sx = (vW - sw) / 2; 
    sy = 0; }
  else { 
    sw = vW; 
    sh = vW / targetAspect; 
    sx = 0; 
    sy = (vH - sh) / 2; }

  ctx.save();
  ctx.translate(WIDTH, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(
    video, 
    sx, sy, sw, sh, 
    WIDTH - photoX - photoW,
    photoY,
    photoW,
    photoH);
  ctx.restore();
  finalizeLaPhoto();
};

const finalizeLaPhoto = () => {
  const { video, ctx, esquisse } = elements;
  video.style.display = 'none';
  const frame = new Image();
  frame.src = 'Assets/Cadre.png';
  frame.onload = () => {
    ctx.drawImage(frame, 0, 0, WIDTH, HEIGHT);
    localStorage.setItem('laPhoto', esquisse.toDataURL('image/png'));
    setTimeout(() => window.location.href = 'final.html', 50);
  };
  frame.complete && frame.onload();
};

const downloadPhoto = () => {
  elements.esquisse.toBlob(blob => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Kueen.png';
    a.click();
  }, 'image/png');
};

const setupCamera = () => {
  navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 2560 }, height: { ideal: 1440 }, facingMode: 'user' }, audio: false })
    .then(stream => { elements.video.srcObject = stream; elements.video.play(); moveVideoToFull(); })
    .catch(err => alert('Camera access failed: ' + err));
};

const setupEventListeners = () => {
  const { takePhotoBtn, downloadBtn } = elements;

  takePhotoBtn.addEventListener('click', () => {
    takePhotoBtn.disabled = true;
    startCountdown(capturePhoto);
  });

  downloadBtn.addEventListener('click', downloadPhoto);
  window.addEventListener('resize', () => {
    moveVideoToFull();
  });
};

const initEsquisse = () => { setupCamera(); setupEventListeners(); };
initEsquisse();

