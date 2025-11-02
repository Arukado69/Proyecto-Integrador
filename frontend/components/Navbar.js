// ---------------- LOGO ----------------
const logo = document.getElementById("logo");

logo.addEventListener("mouseenter", () => { 
  logo.src = "/assets/imagenes/iconos/logo-hover.png"; 
});
logo.addEventListener("mouseleave", () => { 
  logo.src = "/assets/imagenes/iconos/logo-default.png"; 
});
logo.addEventListener("mousedown", () => { 
  logo.src = "/assets/imagenes/iconos/logo-click.png"; 
});
logo.addEventListener("mouseup", () => { 
  logo.src = "/assets/imagenes/iconos/logo-hover.png"; 
});

// ---------------- BOTÓN DE USUARIO ----------------
const userBtn = document.getElementById('userBtn');
const userIcon = document.getElementById('userIcon');
let usuarioActivo = false;

userBtn.addEventListener('click', () => {
  usuarioActivo = !usuarioActivo;
  if (usuarioActivo) {
    userBtn.style.backgroundColor = 'var(--amarillo-400)';
    userIcon.src = '/assets/imagenes/iconos/user-light.png';
  } else {
    userBtn.style.backgroundColor = 'transparent';
    userIcon.src = '/assets/imagenes/iconos/user-dark.png';
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
    comprasIcon.src = '/assets/imagenes/iconos/compras-light.png';
  } else {
    comprasBtn.style.backgroundColor = 'transparent';
    comprasIcon.src = '/assets/imagenes/iconos/compras-dark.png';
  }
});


// ---------------- ICONOS SOCIALES ----------------
const iconButtons = document.querySelectorAll(".icon-btn");

iconButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    btn.classList.add("active");
    setTimeout(() => { btn.classList.remove("active"); }, 300);
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



// ---------------- BOTÓN HAMBURGUESA ----------------
const toggler = document.querySelector('.navbar-toggler-custom');
const navMenu = document.querySelector('.navbar-nav-custom');
let menuAbierto = false;

// Abrir/cerrar menú al hacer clic en la hamburguesa
toggler.addEventListener('click', (e) => {
  menuAbierto = !menuAbierto;
  if (menuAbierto) {
    navMenu.classList.add('show');
  } else {
    navMenu.classList.remove('show');
  }
  e.stopPropagation();
});

// Cerrar menú si se hace clic fuera
document.addEventListener('click', (e) => {
  if (!navMenu.contains(e.target) && !toggler.contains(e.target) && menuAbierto) {
    navMenu.classList.remove('show');
    menuAbierto = false;
  }
});