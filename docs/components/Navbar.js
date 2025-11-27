// Versión Conectada al Backend (Spring Boot)
document.addEventListener("DOMContentLoaded", () => {
    
    const API_URL = 'http://localhost:8080/api'; // Tu servidor Java

    // --- 1. UTILIDADES DE IMÁGENES (Tu código original) ---
    const dirOf = (url) => new URL(url, location.href).href.replace(/[^/]+$/, '');
    const safeSwap = (img, filename) => {
        if (!img) return;
        if (!img.dataset.fallback) img.dataset.fallback = img.src;
        const base = img.dataset.dir || (img.dataset.dir = dirOf(img.src));
        img.onerror = () => { img.onerror = null; img.src = img.dataset.fallback; };
        img.src = base + filename;
    };

    // --- 2. INTERACTIVIDAD VISUAL (Logos, Menús, Scroll) ---
    
    // LOGO
    const logo = document.getElementById("logo");
    if (logo) {
        logo.addEventListener("mouseenter", () => safeSwap(logo, "logo-hover.png"));
        logo.addEventListener("mouseleave", () => safeSwap(logo, "logo-default.png"));
        logo.addEventListener("mousedown",  () => safeSwap(logo, "logo-click.png"));
        logo.addEventListener("mouseup",    () => safeSwap(logo, "logo-hover.png"));
    }

    // BOTÓN DE USUARIO
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

    // BOTÓN DE COMPRAS (Solo efecto visual, el link lo maneja el <a>)
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

    // SCROLL
    window.addEventListener("scroll", () => {
        const navbar = document.querySelector(".navbar-center");
        if (!navbar) return;
        if (window.scrollY > 50) navbar.classList.add("navbar-scrolled");
        else navbar.classList.remove("navbar-scrolled");
    });

    // HAMBURGUESA
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
    //  3. LÓGICA DEL BADGE DEL CARRITO (CONECTADA AL SERVER)
    // ============================================================
    
    // Definimos la función Globalmente
    window.actualizarBadgeNavbar = async function() {
        const badge = document.getElementById('miniCount');
        if (!badge) return; 

        try {
            // AQUI ESTÁ EL CAMBIO: Pedimos al servidor en lugar de leer localStorage
            const response = await fetch(`${API_URL}/carrito`);
            
            if (response.ok) {
                const carrito = await response.json();
                
                // Sumamos cantidades
                const totalArticulos = carrito.reduce((acc, item) => acc + (item.cantidad || 1), 0);

                // Pintamos el número
                badge.innerText = totalArticulos;

                // Mostrar u ocultar
                if (totalArticulos > 0) {
                    badge.classList.remove('d-none');
                    badge.classList.add('d-block');
                } else {
                    badge.classList.add('d-none');
                    badge.classList.remove('d-block');
                }
            } 
        } catch (error) {
            console.error("Error actualizando badge desde servidor:", error);
            // Opcional: Si falla el server, ocultar badge
            badge.classList.add('d-none');
        }
    };

    // Ejecutar al cargar la página para ver el estado actual
    window.actualizarBadgeNavbar();
});