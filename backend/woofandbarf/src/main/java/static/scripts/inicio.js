// Animación del botón principal
const btn = document.getElementById('cta-btn');

btn.addEventListener('click', () => {
  btn.textContent = '¡Agregado!';
  btn.style.backgroundColor = '#95A617';
  
  setTimeout(() => {
    btn.textContent = 'Comprar ahora';
    btn.style.backgroundColor = '';
  }, 1500);
});
