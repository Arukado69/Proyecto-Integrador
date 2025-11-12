// Navbar.js — versión resiliente (sin rutas absolutas)
document.addEventListener("DOMContentLoaded", () => {
  const dirOf = (url) => new URL(url, location.href).href.replace(/[^/]+$/, '');
  const safeSwap = (img, filename) => {
    if (!img) return;
    if (!img.dataset.fallback) img.dataset.fallback = img.src;
    const base = img.dataset.dir || (img.dataset.dir = dirOf(img.src));
    img.onerror = () => { img.onerror = null; img.src = img.dataset.fallback; };
    img.src = base + filename;
  };

  // LOGO (usa la carpeta real del logo actual)
  const logo = document.getElementById("logo");
  if (logo) {
    logo.addEventListener("mouseenter", () => safeSwap(logo, "logo-hover.png"));
    logo.addEventListener("mouseleave", () => safeSwap(logo, "logo-default.png"));
    logo.addEventListener("mousedown",  () => safeSwap(logo, "logo-click.png"));
    logo.addEventListener("mouseup",    () => safeSwap(logo, "logo-hover.png"));
  }

  // BOTÓN DE USUARIO (cambia solo el archivo, no la ruta)
  const userBtn  = document.getElementById('userBtn');
  const userIcon = document.getElementById('userIcon');
  let usuarioActivo = false;
  if (userBtn && userIcon) {
    userBtn.addEventListener('click', () => {
      usuarioActivo = !usuarioActivo;
      userBtn.style.backgroundColor = usuarioActivo ? 'var(--amarillo-400)' : 'transparent';
      safeSwap(userIcon, usuarioActivo ? 'user-light.png' : 'user-dark.png');
    });
  }

  // BOTÓN DE COMPRAS (no toca el badge)
  const comprasBtn  = document.getElementById('comprasBtn');
  const comprasIcon = document.getElementById('comprasIcon');
  let compraActiva = false;
  if (comprasBtn && comprasIcon) {
    comprasBtn.addEventListener('click', () => {
      compraActiva = !compraActiva;
      comprasBtn.style.backgroundColor = compraActiva ? 'var(--amarillo-400)' : 'transparent';
      safeSwap(comprasIcon, compraActiva ? 'compras-light.png' : 'compras-dark.png');
    });
  }

  // ICONOS sociales del header (si existen)
  document.querySelectorAll(".icon-btn")?.forEach(btn => {
    btn.addEventListener("click", () => {
      btn.classList.add("active");
      setTimeout(() => btn.classList.remove("active"), 300);
    });
  });

  // Scroll color
  window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar-center");
    if (!navbar) return;
    if (window.scrollY > 50) navbar.classList.add("navbar-scrolled");
    else navbar.classList.remove("navbar-scrolled");
  });

  // Hamburguesa
  const toggler = document.querySelector('.navbar-toggler-custom');
  const navMenu = document.querySelector('.navbar-nav-custom');
  if (toggler && navMenu) {
    let menuAbierto = false;
    toggler.addEventListener('click', (e) => {
      menuAbierto = !menuAbierto;
      navMenu.classList.toggle('show', menuAbierto);
      e.stopPropagation();
    });
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !toggler.contains(e.target) && menuAbierto) {
        navMenu.classList.remove('show'); menuAbierto = false;
      }
    });
  }

  // === Sincroniza el badge del carrito (asunción de llaves/localStorage) ===
  const badge = document.getElementById('cart-count') || document.querySelector('[data-cart-badge]');
  const readCount = () => {
    try {
      const keys = ['carrito','cart','shoppingCart'];
      for (const k of keys) {
        const raw = localStorage.getItem(k);
        if (!raw) continue;
        const data = JSON.parse(raw);
        if (Array.isArray(data)) {
          // si tienen quantity usa la suma, si no, usa length
          const qty = data.reduce((a, it) => a + (Number(it.quantity || it.qty || 1)), 0);
          return qty || data.length;
        }
        if (typeof data === 'object' && data.items) {
          const arr = Array.isArray(data.items) ? data.items : [];
          return arr.reduce((a, it) => a + (Number(it.quantity || it.qty || 1)), 0) || arr.length;
        }
      }
    } catch (_) {}
    return 0;
  };
  const syncBadge = () => { if (badge) badge.textContent = readCount(); };
  syncBadge();
  window.addEventListener('storage', (e) => { if (e.key) syncBadge(); });
  window.syncCartBadge = syncBadge;
  
});
