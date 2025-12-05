// Versión Conectada al Backend (Spring Boot) - CORREGIDA
document.addEventListener("DOMContentLoaded", () => {
    
    // CORRECCIÓN 1: La ruta base correcta incluye /v1
    const API_URL = 'http://52.15.203.222:8080/api/v1'; // Conexión para que funcione minicount de carrito y catálogo 

    // --- 1. UTILIDADES DE IMÁGENES ---
    const dirOf = (url) => new URL(url, location.href).href.replace(/[^/]+$/, '');
    const safeSwap = (img, filename) => {
        if (!img) return;
        if (!img.dataset.fallback) img.dataset.fallback = img.src;
        const base = img.dataset.dir || (img.dataset.dir = dirOf(img.src));
        img.onerror = () => { img.onerror = null; img.src = img.dataset.fallback; };
        img.src = base + filename;
    };

    // --- 2. INTERACTIVIDAD VISUAL ---
    
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

    // BOTÓN DE COMPRAS
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
    //  3. LÓGICA DEL BADGE DEL CARRITO (función de minicount, NO borrar)
    // ============================================================
    
    window.actualizarBadgeNavbar = async function() {
        const badge = document.getElementById('miniCount');
        if (!badge) return; 

        // CORRECCIÓN 2: Obtener usuario del localStorage
        const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));

        // Si no hay usuario, ocultamos el badge y salimos
        if (!usuarioLogueado) {
            badge.classList.add('d-none');
            return;
        }

        try {
            // CORRECCIÓN 3: Usar la URL correcta con el ID del usuario
            // GET /api/v1/carrito/usuario/{id}
            const response = await fetch(`${API_URL}/carrito/usuario/${usuarioLogueado.id}`);
            
            if (response.ok) {
                const carrito = await response.json();
                
                // CORRECCIÓN 4: Acceder a 'carrito.detalles' para sumar
                // (El backend devuelve un objeto Carrito, no un array directo)
                const detalles = carrito.detalles || [];
                const totalArticulos = detalles.reduce((acc, item) => acc + (item.cantidad || 0), 0);

                // Pintamos el número
                badge.innerText = totalArticulos;

                // Mostrar u ocultar según cantidad
                if (totalArticulos > 0) {
                    badge.classList.remove('d-none');
                    badge.classList.add('d-block');
                } else {
                    badge.classList.add('d-none');
                    badge.classList.remove('d-block');
                }
            } 
        } catch (error) {
            // console.error("Error silencioso badge:", error);
            badge.classList.add('d-none');
        }
    };

    // Ejecutar al cargar la página
    window.actualizarBadgeNavbar();
});