const bienvenueButton = document.getElementById('bienvenue-button');
const youpiButton = document.getElementById('youpi-button');

function addSafeNavigation(button, url, id) {
  if (!button) return;

  button.addEventListener('click', e => {
    if (typeof gtag === 'function') {
      gtag('event', 'button_click', {
        button_id: id || button.id || 'no-id',
        button_text: button.innerText || 'no-text',});
      console.log('GA event sent:', id || button.id);
    }

    e.preventDefault();
    setTimeout(() => (window.location.href = url), 100);
  });
}

addSafeNavigation(bienvenueButton, 'youpi.html');
addSafeNavigation(youpiButton, 'camera.html')