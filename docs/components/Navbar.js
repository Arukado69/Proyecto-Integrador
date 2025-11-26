// Navbar.js — Versión Integrada Woof & Barf
document.addEventListener("DOMContentLoaded", () => {
    
    // --- UTILIDADES DE IMÁGENES (Tu código original) ---
    const dirOf = (url) => new URL(url, location.href).href.replace(/[^/]+$/, '');
    const safeSwap = (img, filename) => {
        if (!img) return;
        if (!img.dataset.fallback) img.dataset.fallback = img.src;
        const base = img.dataset.dir || (img.dataset.dir = dirOf(img.src));
        img.onerror = () => { img.onerror = null; img.src = img.dataset.fallback; };
        img.src = base + filename;
    };

    // --- LOGO ---
    const logo = document.getElementById("logo");
    if (logo) {
        logo.addEventListener("mouseenter", () => safeSwap(logo, "logo-hover.png"));
        logo.addEventListener("mouseleave", () => safeSwap(logo, "logo-default.png"));
        logo.addEventListener("mousedown",  () => safeSwap(logo, "logo-click.png"));
        logo.addEventListener("mouseup",    () => safeSwap(logo, "logo-hover.png"));
    }

    // --- BOTÓN DE USUARIO ---
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

    // --- BOTÓN DE COMPRAS (Icono visual) ---
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

    // --- SCROLL COLOR ---
    window.addEventListener("scroll", () => {
        const navbar = document.querySelector(".navbar-center");
        if (!navbar) return;
        if (window.scrollY > 50) navbar.classList.add("navbar-scrolled");
        else navbar.classList.remove("navbar-scrolled");
    });

    // --- HAMBURGUESA (Móvil) ---
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
                navMenu.classList.remove('show'); 
                menuAbierto = false;
            }
        });
    }

    // ============================================================
    //  LÓGICA DEL BADGE DEL CARRITO (miniCount)
    // ============================================================
    
    // 1. Definimos la función Globalmente para que otros scripts la usen
    window.actualizarBadgeNavbar = function() {
        const badge = document.getElementById('miniCount');
        if (!badge) return; // Si no existe el elemento en el HTML, salimos

        // Leemos TU llave específica del localStorage
        const carrito = JSON.parse(localStorage.getItem('carritoWoofBarf')) || [];
        
        // Sumamos las cantidades (item.cantidad)
        const totalArticulos = carrito.reduce((acc, item) => acc + (item.cantidad || 1), 0);

        // Actualizamos el texto
        badge.innerText = totalArticulos;

        // Lógica de visibilidad (Ocultar si es 0)
        if (totalArticulos > 0) {
            badge.classList.remove('d-none');
            badge.classList.add('d-block'); // Asegura visualización en Bootstrap
        } else {
            badge.classList.add('d-none');  // Oculta visualmente
            badge.classList.remove('d-block');
        }
    };

    // 2. Ejecutar al cargar la página (Inicialización)
    window.actualizarBadgeNavbar();

    // 3. Escuchar cambios en otras pestañas (Sincronización entre tabs)
    window.addEventListener('storage', (e) => {
        if (e.key === 'carritoWoofBarf') {
            window.actualizarBadgeNavbar();
        }
    });

    // Soporte legacy por si en algún lado llamaste a 'syncCartBadge'
    window.syncCartBadge = window.actualizarBadgeNavbar;
});