// --- CONFIGURACIÓN BACKEND ---
const API_URL = 'http://localhost:8080/api/v1';

// ------- Variables Globales -------
let listaDeProductos = [];
let filtered = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 6;

// ------- Elementos del DOM -------
const productRow   = document.getElementById('product-row');
const paginationEl = document.getElementById('pagination-container');
const resultsInfo  = document.getElementById('results-info');
const searchInput  = document.getElementById('searchInput');
const applyBtn     = document.getElementById('applyFiltersBtn');
const filtersForm  = document.getElementById('filtersForm');

// ======================================================
// 1. CARGA DE DATOS (GET)
// ======================================================

async function cargarProductos() {
    try {
        const response = await fetch(`${API_URL}/productos`); 
        if(response.ok) {
            listaDeProductos = await response.json();
            console.log("Inventario cargado:", listaDeProductos); 
            
            // Inicializamos mostrando todo
            filtered = [...listaDeProductos];
            // Llamamos a renderPage directamente la primera vez para asegurar que se vea algo
            renderPage(1); 
        } else {
            productRow.innerHTML = '<div class="col-12 text-center"><p>No se pudo cargar el inventario.</p></div>';
        }
    } catch (e) {
        console.error("Error:", e);
        productRow.innerHTML = '<div class="col-12 text-center text-danger"><p>Error de conexión con el servidor.</p></div>';
    }
}

// ======================================================
// 2. LÓGICA DE FILTROS (CORREGIDA)
// ======================================================

function applyFilters() {
    // 1. Obtenemos valores de los inputs
    const term = (searchInput.value || '').trim().toLowerCase();
    
    // Función auxiliar para leer los radio buttons de forma segura
    const getRadio = (name) => {
        const el = document.querySelector(`input[name="${name}"]:checked`);
        return el ? el.value.toLowerCase() : "";
    };

    const selectedFlavor = getRadio('flavor');
    const selectedCategory = getRadio('category');
    const selectedSize = getRadio('size');

    console.log("Filtrando por:", { term, selectedFlavor, selectedCategory, selectedSize });

    // 2. Filtramos la lista usando las PROPIEDADES EN ESPAÑOL (Backend)
    filtered = listaDeProductos.filter(p => {
        // Datos del producto (protegidos contra nulos)
        const pNombre = (p.nombre || '').toLowerCase();
        const pDesc   = (p.descripcion || '').toLowerCase();
        const pSabor  = (p.sabor || '').toLowerCase();
        const pCat    = (p.categoria || '').toLowerCase();
        const pTamano = (p.tamano || '').toLowerCase();

        // A) Filtro Texto (Nombre o Descripción)
        const matchText = !term || pNombre.includes(term) || pDesc.includes(term);
        
        // B) Filtro Sabor
        const matchFlavor = !selectedFlavor || pSabor === selectedFlavor || pSabor.includes(selectedFlavor);
        
        // C) Filtro Categoría
        const matchCategory = !selectedCategory || pCat === selectedCategory;
        
        // D) Filtro Tamaño
        const matchSize = !selectedSize || pTamano === selectedSize;

        return matchText && matchFlavor && matchCategory && matchSize;
    });

    // 3. Renderizar resultados filtrados
    renderPage(1);
}

// ======================================================
// 3. RENDERIZADO (Cards con Estilo Fijo)
// ======================================================

function createProductCard(item) {
    const { idProducto, nombre, precio, imagenUrl, descripcion, sabor, tamano, categoria } = item;
    
    // Fallback de imagen si viene vacía o nula
    // Asegúrate de que esta ruta local exista en tu proyecto
    const imgFinal = imagenUrl && imagenUrl.trim() !== '' 
        ? imagenUrl 
        : '../assets/imagenes/iconos/logo-default.png';

    return `
      <div class="col d-flex align-items-stretch"> <div class="card card-producto rounded-5 shadow-sm hover-zoom w-100 h-100 border-0">
          
          <div style="height: 250px; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #fff;" class="rounded-top-5">
              <img src="${imgFinal}" 
                   alt="${nombre}" 
                   class="img-fluid" 
                   style="max-height: 100%; object-fit: contain;"
                   onerror="this.src='../assets/imagenes/iconos/logo-default.png'">
          </div>
          
          <div class="card-body text-center d-flex flex-column p-4">
            <h5 class="card-title catalogo-roboto-h4 mb-2 text-dark">${nombre}</h5>
            
            <p class="text-muted small mb-3 flex-grow-1" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                ${descripcion || 'Sin descripción disponible.'}
            </p>
            
            <div class="mb-3 d-flex justify-content-center gap-2 flex-wrap">
                ${sabor ? `<span class="badge bg-light text-dark border">${sabor}</span>` : ''}
                ${tamano ? `<span class="badge bg-light text-dark border">${tamano}</span>` : ''}
            </div>
            
            <h4 class="catalogo-price-color catalogo-roboto-h4 mb-3 fw-bold">$${precio.toFixed(2)}</h4>
            
            <button class="btn w-100 rounded-4 catalogo-secundary-button-color catalogo-roboto-primary-label py-2" 
                    onclick="window.agregarAlCarrito(${idProducto})">
                Añadir al carrito
            </button>
          </div>
        </div>
      </div>`;
}

function renderPage(page = 1) {
    // Validar si hay resultados
    if (filtered.length === 0) {
        productRow.innerHTML = `
          <div class="col-12 text-center py-5">
              <p class="fs-1">🔍</p>
              <h3 class="h5 text-muted">No encontramos productos</h3>
              <p class="small text-muted">Intenta con otros filtros o términos de búsqueda.</p>
              <button class="btn btn-outline-dark btn-sm mt-2" onclick="limpiarFiltros()">Ver todo el catálogo</button>
          </div>`;
        resultsInfo.textContent = '';
        paginationEl.innerHTML = '';
        return;
    }

    // Lógica Paginación
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
    currentPage = Math.min(Math.max(1, page), totalPages);
    
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = Math.min(start + ITEMS_PER_PAGE, total);
    
    // Inyectar HTML
    productRow.innerHTML = filtered.slice(start, end).map(createProductCard).join('');
    resultsInfo.textContent = `Mostrando ${start + 1}–${end} de ${total} productos`;

    // Botones Paginación
    if(total > ITEMS_PER_PAGE){
        paginationEl.innerHTML = `
          <nav>
            <ul class="pagination justify-content-center">
              <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                 <button class="page-link rounded-start-4" onclick="renderPage(${currentPage - 1})">Anterior</button>
              </li>
              <li class="page-item disabled d-none d-md-block">
                 <span class="page-link border-0 bg-transparent text-muted">Página ${currentPage} de ${totalPages}</span>
              </li>
              <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                 <button class="page-link rounded-end-4" onclick="renderPage(${currentPage + 1})">Siguiente</button>
              </li>
            </ul>
          </nav>`;
    } else {
        paginationEl.innerHTML = '';
    }
}

// Hacer global para botones HTML
window.renderPage = renderPage;
window.limpiarFiltros = function() {
    if(filtersForm) {
        filtersForm.reset();
        // Restablecer radio buttons manualmente si reset() falla visualmente
        const radios = filtersForm.querySelectorAll('input[type="radio"]');
        radios.forEach(r => r.checked = r.defaultChecked);
    }
    if(searchInput) searchInput.value = '';
    applyFilters();
}

// ======================================================
// 4. AGREGAR AL CARRITO (POST)
// ======================================================

window.agregarAlCarrito = async function(idProducto) {
    const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));
    
    if (!usuarioLogueado) {
        // Usamos modal bonito si no está logueado
        mostrarModalBootstrap({
            title: "Inicia Sesión",
            text: "Para agregar productos a tu carrito, necesitas ingresar a tu cuenta.",
            confirmText: "Ir al Login",
            cancelText: "Cancelar"
        });
        
        // Sobrescribimos el botón de confirmar para ir al login
        const btnConfirm = document.getElementById('btnConfirmar');
        if(btnConfirm) {
            btnConfirm.onclick = () => window.location.href = "iniciosesion.html";
        }
        return;
    }

    try {
        const res = await fetch(`${API_URL}/carrito/agregar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                idUsuario: usuarioLogueado.id, 
                idProducto: idProducto, 
                cantidad: 1 
            })
        });

        if(res.ok) {
            // Mostrar Modal Éxito
            mostrarModalBootstrap({
                title: "¡Producto Agregado!",
                text: "Se añadió correctamente a tu carrito.",
                confirmText: "Seguir comprando",
                cancelText: "Ir al carrito"
            });
            
            // Lógica botones modal éxito
            const btnCancel = document.getElementById('btnCancelar');
            if(btnCancel) {
                btnCancel.onclick = () => window.location.href = 'carrito.html';
            }
            const btnConfirm = document.getElementById('btnConfirmar');
            if(btnConfirm) {
                btnConfirm.onclick = () => {
                    const modal = bootstrap.Modal.getInstance(document.getElementById('modalWoof'));
                    modal.hide();
                };
            }
            
            // Actualizar badge
            if(window.actualizarBadgeNavbar) window.actualizarBadgeNavbar();
            
        } else {
            console.error("Error server:", await res.text());
            alert("No se pudo agregar el producto. Intenta de nuevo.");
        }
    } catch(e) { 
        console.error(e); 
        alert("Error de conexión con el servidor.");
    }
};

// Helper Modal (Debe coincidir con tu HTML)
function mostrarModalBootstrap({ title, text, confirmText, cancelText }) {
    const modalEl = document.getElementById('modalWoof');
    if(!modalEl) return; 

    document.getElementById('modalTitulo').innerText = title;
    document.getElementById('modalMensaje').innerText = text;
    
    const btnConfirm = document.getElementById('btnConfirmar');
    const btnCancel = document.getElementById('btnCancelar');
    
    if(btnConfirm) btnConfirm.innerText = confirmText;
    
    if(btnCancel) {
        btnCancel.innerText = cancelText || "Cancelar";
        btnCancel.classList.remove('d-none');
    }

    const modal = new bootstrap.Modal(modalEl);
    modal.show();
}


// ======================================================
// 5. INICIALIZACIÓN
// ======================================================
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos(); 
    
    // Eventos Filtros
    if(searchInput) searchInput.addEventListener('keyup', applyFilters);
    if(applyBtn) applyBtn.addEventListener('click', applyFilters);
    
    if(filtersForm) {
        filtersForm.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', applyFilters);
        });
    }
});