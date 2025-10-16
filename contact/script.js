(() => {
  'use strict';

  // Validación Bootstrap (sin consola ruidosa)
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  }

  // Pequeño efecto accesible en iconos sociales
  const links = document.querySelectorAll('.contact-page .social-link');
  links.forEach(a => {
    a.addEventListener('focus', () => a.classList.add('shadow-sm'));
    a.addEventListener('blur',  () => a.classList.remove('shadow-sm'));
  });
})();
