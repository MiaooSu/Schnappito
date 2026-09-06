const WIDTH = 1041, HEIGHT = 1484;

const esquisse = document.getElementById('esquisseFinale'),
      ctx = esquisse.getContext('2d'),
      addCouronneBtn = document.getElementById('addCouronne'),
      addBouffonneBtn = document.getElementById('addBouffonne'),
      addFleurBtn = document.getElementById('addFleur'),
      addPoulpyBtn = document.getElementById('addPoulpy'),
      addFeuBtn = document.getElementById('addFeu'),
      downloadBtn = document.getElementById('downloadBtn'),
      homeBtn = document.getElementById('homeBtn'),
      encoreBtn = document.getElementById('encore');

let stickers = [], dragOffset = { x: 0, y: 0 }, selectedSticker = null;

const finalImage = new Image(), dataURL = localStorage.getItem('laPhoto');

const merImage = new Image();
merImage.onload = () => {
  console.log("Mer.png ok !");
  console.log(merImage.width, merImage.height);
  drawEsquisse();
};

merImage.onerror = () => { console.error("Impossible fing Mer.png"); };
merImage.src = 'Assets/Mer.png';

if (dataURL) {
  finalImage.src = dataURL;
  finalImage.onload = drawEsquisse;
  localStorage.removeItem('laPhoto');
} else alert("No photo found!");


function drawEsquisse() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.drawImage(merImage, 0, 0, WIDTH, HEIGHT);
  ctx.drawImage(finalImage, 0, 0, WIDTH, HEIGHT);
  stickers.forEach(s => ctx.drawImage(s.img, s.x, s.y, s.width, s.height));
}

function addSticker(src) {
  const img = new Image();
  img.src = src;
  img.onload = () => {
    stickers.push({
    img,
    x: WIDTH / 2 - img.width / 6,
    y: HEIGHT / 2 - img.height / 6,
    width: img.width / 2.5,
    height: img.height / 2.5,
    dragging: false});
    drawEsquisse();
  };
}

function getPointerPos(e) {
  const rect = esquisse.getBoundingClientRect(), scaleX = esquisse.width / rect.width, scaleY = esquisse.height / rect.height;
  const clientX = e.touches?.[0]?.clientX ?? e.clientX,
        clientY = e.touches?.[0]?.clientY ?? e.clientY;
  return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
}

function pointerDown(e) {
  const { x: mouseX, y: mouseY } = getPointerPos(e);
  for (let i = stickers.length - 1; i >= 0; i--) {
    const s = stickers[i];
    if (mouseX >= s.x && mouseX <= s.x + s.width && mouseY >= s.y && mouseY <= s.y + s.height) {
      selectedSticker = s;
      s.dragging = true;
      dragOffset.x = mouseX - s.x;
      dragOffset.y = mouseY - s.y;
      stickers.splice(i, 1);
      stickers.push(s);
      drawEsquisse();
      e.preventDefault();
      break;
    }
  }
}
function pointerMove(e) {
  if (!selectedSticker?.dragging) return;
  const { x: mouseX, y: mouseY } = getPointerPos(e);
  selectedSticker.x = mouseX - dragOffset.x;
  selectedSticker.y = mouseY - dragOffset.y;
  drawEsquisse();
  e.preventDefault();
}
function pointerUp() { if (selectedSticker) selectedSticker.dragging = false; selectedSticker = null; }

esquisse.addEventListener('mousedown', pointerDown);
esquisse.addEventListener('mousemove', pointerMove);
esquisse.addEventListener('mouseup', pointerUp);
esquisse.addEventListener('mouseleave', pointerUp);

esquisse.addEventListener('touchstart', pointerDown);
esquisse.addEventListener('touchmove', pointerMove);
esquisse.addEventListener('touchend', pointerUp);
esquisse.addEventListener('touchcancel', pointerUp);

addCouronneBtn.addEventListener('click', () => addSticker('Assets/Couronne.png'));
addBouffonneBtn.addEventListener('click', () => addSticker('Assets/Bouffonne.png'));

const fleursImages = ['Assets/Fleur1.png','Assets/Fleur2.png'], 
      feuxImages = ['Assets/Feu1.png','Assets/Feu2.png'];
let seaweedIndex = 0, bubbleIndex = 0;

addFleurBtn.addEventListener('click', () => { addSticker(fleursImages[seaweedIndex]); seaweedIndex = (seaweedIndex + 1) % fleursImages.length; });
addPoulpyBtn.addEventListener('click', () => addSticker('Assets/Poulpy.png'));
addFeuBtn.addEventListener('click', () => { addSticker(feuxImages[bubbleIndex]); bubbleIndex = (bubbleIndex + 1) % feuxImages.length; });

encoreBtn.addEventListener('click', () => { stickers = []; drawEsquisse(); });

downloadBtn.addEventListener('click', () => {
  esquisse.toBlob(blob => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'Kueen.png'; a.click(); }, 'image/png');
});

const destinationURL = 'https://t.me/+7YolFtV5lu9lOThk';
homeBtn.addEventListener('click', () => {
  window.open(destinationURL, '_blank');
  window.location.href = 'index.html'; 
})
