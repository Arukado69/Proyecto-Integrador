// Variables globales
let currentPage = 1;
const totalPages = 2;

// Elementos del DOM
const postsSlider = document.getElementById('postsSlider');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const prevBtnLi = document.getElementById('prevBtnLi');
const nextBtnLi = document.getElementById('nextBtnLi');
const paginationNumbers = document.querySelectorAll('.pagination-number');
const postsPages = document.querySelectorAll('.posts-page');

// Función para cambiar de página
function goToPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    
    currentPage = pageNumber;
    
    // Calcular desplazamiento
    const offset = -(pageNumber - 1) * 100;
    postsSlider.style.transform = `translateX(${offset}%)`;
    
    // Actualizar clases activas de las páginas
    postsPages.forEach((page, index) => {
        if (index === pageNumber - 1) {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    });
    
    // Actualizar botones de paginación
    updatePaginationButtons();
}

// Función para actualizar el estado de los botones
function updatePaginationButtons() {
    // Actualizar botón anterior
    if (currentPage === 1) {
        prevBtnLi.classList.add('disabled');
        prevBtn.disabled = true;
    } else {
        prevBtnLi.classList.remove('disabled');
        prevBtn.disabled = false;
    }
    
    // Actualizar botón siguiente
    if (currentPage === totalPages) {
        nextBtnLi.classList.add('disabled');
        nextBtn.disabled = true;
    } else {
        nextBtnLi.classList.remove('disabled');
        nextBtn.disabled = false;
    }
    
    // Actualizar números de página
    paginationNumbers.forEach(btn => {
        const pageNum = parseInt(btn.dataset.page);
        const parentLi = btn.closest('.page-item');
        
        // Solo mostrar números de página 1 y 2
        if (pageNum > totalPages) {
            parentLi.style.display = 'none';
        } else {
            parentLi.style.display = 'block';
            
            if (pageNum === currentPage) {
                parentLi.classList.add('active');
            } else {
                parentLi.classList.remove('active');
            }
        }
    });
}

// Event listeners para botones de navegación
prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPage > 1) {
        goToPage(currentPage - 1);
    }
});

nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
        goToPage(currentPage + 1);
    }
});

// Event listeners para números de página
paginationNumbers.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const pageNum = parseInt(btn.dataset.page);
        goToPage(pageNum);
    });
});

// Navegación con teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentPage > 1) {
        goToPage(currentPage - 1);
    } else if (e.key === 'ArrowRight' && currentPage < totalPages) {
        goToPage(currentPage + 1);
    }
});

// Soporte para gestos táctiles (swipe)
let touchStartX = 0;
let touchEndX = 0;

postsSlider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

postsSlider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next page
            if (currentPage < totalPages) {
                goToPage(currentPage + 1);
            }
        } else {
            // Swipe right - previous page
            if (currentPage > 1) {
                goToPage(currentPage - 1);
            }
        }
    }
}

// Animación de scroll suave para categorías
const categoryTags = document.querySelectorAll('.category-tag');
categoryTags.forEach((tag, index) => {
    tag.style.opacity = '0';
    tag.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        tag.style.transition = 'all 0.5s ease';
        tag.style.opacity = '1';
        tag.style.transform = 'translateY(0)';
    }, 100 * index);
});

// Intersection Observer para animaciones al hacer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar las secciones principales
document.querySelectorAll('.featured-articles, .recent-posts').forEach(section => {
    observer.observe(section);
});

// Efecto hover mejorado para tarjetas con sonido visual
document.querySelectorAll('.article-card, .post-item').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

// Prevenir click en botones deshabilitados
document.querySelectorAll('.pagination-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (btn.disabled) {
            e.preventDefault();
            e.stopPropagation();
        }
    });
});

// Smooth scroll al cambiar de página
function smoothScrollToTop() {
    const recentPostsSection = document.querySelector('.recent-posts');
    if (recentPostsSection) {
        recentPostsSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
}

// Llamar smooth scroll al cambiar página (opcional)
const originalGoToPage = goToPage;
goToPage = function(pageNumber) {
    originalGoToPage(pageNumber);
    // Descomentar si quieres scroll automático al cambiar de página
    // smoothScrollToTop();
};

// Inicializar el estado de los botones al cargar la página
updatePaginationButtons();

// Añadir efecto de carga inicial
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animar elementos al cargar
    const articleCards = document.querySelectorAll('.article-card');
    articleCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = `fadeInUp 0.6s ease forwards`;
        }, index * 100);
    });
});

// Tooltip de Bootstrap (si se necesita)
if (typeof bootstrap !== 'undefined') {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Manejo de errores de imágenes
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.src = 'https://via.placeholder.com/400x300?text=Imagen+no+disponible';
        this.alt = 'Imagen no disponible';
    });
});

// Performance: Lazy loading para imágenes (si no está nativo)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Accesibilidad: Anunciar cambios de página a lectores de pantalla
function announcePageChange(pageNum) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'visually-hidden';
    announcement.textContent = `Página ${pageNum} de ${totalPages} cargada`;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Actualizar goToPage para incluir anuncio
const finalGoToPage = goToPage;
goToPage = function(pageNumber) {
    finalGoToPage(pageNumber);
    announcePageChange(pageNumber);
};

// Debug mode (opcional - remover en producción)
const DEBUG = false;
if (DEBUG) {
    console.log('IndexBlog.js inicializado');
    console.log(`Total de páginas: ${totalPages}`);
    console.log(`Página actual: ${currentPage}`);
}