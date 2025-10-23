// ---------------- LOGO ----------------
const logo = document.getElementById("logo");

logo.addEventListener("mouseenter", () => { 
  logo.src = "imagenes/logo-hover.png"; 
});
logo.addEventListener("mouseleave", () => { 
  logo.src = "imagenes/logo-default.png"; 
});
logo.addEventListener("mousedown", () => { 
  logo.src = "imagenes/logo-click.png"; 
});
logo.addEventListener("mouseup", () => { 
  logo.src = "imagenes/logo-hover.png"; 
});

// ---------------- BOTÓN DE USUARIO ----------------
const userBtn = document.getElementById('userBtn');
const userIcon = document.getElementById('userIcon');
let usuarioActivo = false;

userBtn.addEventListener('click', () => {
  usuarioActivo = !usuarioActivo;
  if (usuarioActivo) {
    userBtn.style.backgroundColor = 'var(--amarillo-400)';
    userIcon.src = 'imagenes/user-light.png';
  } else {
    userBtn.style.backgroundColor = 'transparent';
    userIcon.src = 'imagenes/user-dark.png';
  }
});

// ---------------- BOTÓN DE COMPRAS ----------------
const comprasBtn = document.getElementById('comprasBtn');
const comprasIcon = document.getElementById('comprasIcon');
let compraActiva = false;

comprasBtn.addEventListener('click', () => {
  compraActiva = !compraActiva;
  if (compraActiva) {
    comprasBtn.style.backgroundColor = 'var(--amarillo-400)';
    comprasIcon.src = 'imagenes/compras-light.png';
  } else {
    comprasBtn.style.backgroundColor = 'transparent';
    comprasIcon.src = 'imagenes/compras-dark.png';
  }
});

// ---------------- BOTÓN HAMBURGUESA ----------------
const toggler = document.querySelector('.navbar-toggler-custom');
const navMenu = document.querySelector('.navbar-nav-custom');

toggler.addEventListener('click', () => {
  navMenu.classList.toggle('show');
});

// ---------------- ICONOS SOCIALES ----------------
const iconButtons = document.querySelectorAll(".icon-btn");

iconButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    btn.classList.add("active");
    setTimeout(() => { btn.classList.remove("active"); }, 200);
  });
});

// ---- CAMBIO DE COLOR AL HACER SCROLL ----
window.addEventListener("scroll", function() {
  const navbar = document.querySelector(".navbar-center");
  if (window.scrollY > 50) {
    navbar.classList.add("navbar-scrolled");
  } else {
    navbar.classList.remove("navbar-scrolled");
  }
});
