// --- CONFIGURACIÓN BACKEND ---
const API_URL = 'http://52.15.203.222:8080/api/v1';

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
const filtersForm  = document.getElementById('filtersForm'); // Quitamos applyBtn porque es automático

// ======================================================
// 1. CARGA DE DATOS (GET)
// ======================================================

async function cargarProductos() {
    try {
        const response = await fetch(`${API_URL}/productos`); 
        if(response.ok) {
            listaDeProductos = await response.json();
            console.log("Inventario cargado:", listaDeProductos); 
            
            // Inicializar filtros
            filtered = [...listaDeProductos];
            applyFilters(); 
        } else {
            productRow.innerHTML = '<div class="col-12 text-center py-5"><p>No se pudo cargar el inventario.</p></div>';
        }
    } catch (e) {
        console.error("Error:", e);
        productRow.innerHTML = '<div class="col-12 text-center py-5 text-danger"><p>Error de conexión con el servidor.</p></div>';
    }
}

// ======================================================
// 2. LÓGICA DE FILTROS (ROBUSTA & SEGURA)
// ======================================================

function applyFilters() {
    // 1. Obtenemos valores de los inputs
    const term = (searchInput.value || '').trim().toLowerCase();
    
    // Helper para leer radio buttons
    const getRadio = (name) => {
        const el = document.querySelector(`input[name="${name}"]:checked`);
        return el ? String(el.value).trim().toLowerCase() : "";
    };

    const selectedFlavor = getRadio('flavor');
    const selectedCategory = getRadio('category');
    const selectedSize = getRadio('size');

    console.log("Filtros activos:", { term, selectedFlavor, selectedCategory, selectedSize });

    // 2. Filtramos la lista
    filtered = listaDeProductos.filter(p => {
        // --- MAPEO EXACTO CON TU BACKEND (JAVA) ---
        // Usamos String(p.variable || '') para evitar errores si viene null del servidor
        
        const pNombre = String(p.nombre || '').toLowerCase();
        const pDesc   = String(p.descripcion || '').toLowerCase();
        const pSabor  = String(p.sabor || '').toLowerCase(); 
        const pCat    = String(p.categoria || '').toLowerCase();
        const pTamano = String(p.tamano || '').toLowerCase(); // Ojo: Java manda "tamano" (sin ñ)

        // --- COMPARACIONES ---

        // A) Texto
        const matchText = !term || pNombre.includes(term) || pDesc.includes(term);
        
        // B) Sabor
        // Usamos .includes() para ser flexibles (ej: "Pollo" encuentra "Pollo y Arroz")
        const matchFlavor = !selectedFlavor || pSabor.includes(selectedFlavor);
        
        // C) Categoría
        const matchCategory = !selectedCategory || pCat.includes(selectedCategory);
        
        // D) Tamaño
        const matchSize = !selectedSize || pTamano.includes(selectedSize);

        // Deben cumplirse TODAS las condiciones
        return matchText && matchFlavor && matchCategory && matchSize;
    });

    // 3. Renderizar resultados
    renderPage(1);
}

// ======================================================
// 3. RENDERIZADO (CARDS ALINEADAS)
// ======================================================

function createProductCard(item) {
    const { idProducto, nombre, precio, imagenUrl, descripcion, sabor, tamano, categoria } = item;
    
    // Fallback de imagen
    const imgFinal = imagenUrl && imagenUrl.trim() !== '' 
        ? imagenUrl 
        : '../assets/imagenes/iconos/logo-default.png';

    return `
      <div class="col d-flex align-items-stretch">
        <div class="card card-producto rounded-5 shadow-sm hover-zoom w-100 h-100 border-0">
          
          <div style="height: 250px; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #fff;" class="rounded-top-5">
              <img src="${imgFinal}" 
                   alt="${nombre}" 
                   class="img-fluid" 
                   loading="lazy"
                   style="max-height: 100%; object-fit: contain;"
                   onerror="this.src='../assets/imagenes/iconos/logo-default.png'">
          </div>
          
          <div class="card-body text-center d-flex flex-column p-4">
            
            <h5 class="card-title catalogo-roboto-h4 mb-2 text-dark text-truncate" title="${nombre}">
                ${nombre}
            </h5>
            
            <p class="text-muted small mb-3 flex-grow-0" 
               style="min-height: 40px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                ${descripcion || ''}
            </p>
            
            <div class="mb-3 d-flex justify-content-center gap-2 flex-wrap" style="min-height: 26px;">
                ${sabor ? `<span class="badge bg-light text-dark border">${sabor}</span>` : ''}
                ${tamano ? `<span class="badge bg-light text-dark border">${tamano}</span>` : ''}
                ${categoria ? `<span class="badge bg-light text-dark border">${categoria}</span>` : ''}
            </div>
            
            <div class="mt-auto">
                <h4 class="catalogo-price-color catalogo-roboto-h4 mb-3 fw-bold">$${precio.toFixed(2)}</h4>
                
                <button class="btn w-100 rounded-4 catalogo-secundary-button-color catalogo-roboto-primary-label py-2" 
                        onclick="window.agregarAlCarrito(${idProducto})">
                    Añadir al carrito
                </button>
            </div>

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
              <p class="small text-muted">Intenta con otros filtros.</p>
              <button class="btn btn-outline-dark btn-sm mt-2" onclick="limpiarFiltros()">Ver todo</button>
          </div>`;
        resultsInfo.textContent = '';
        paginationEl.innerHTML = '';
        return;
    }

    // Paginación
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
        const radios = filtersForm.querySelectorAll('input[type="radio"]');
        radios.forEach(r => { if(r.value === "") r.checked = true; });
    }
    if(searchInput) searchInput.value = '';
    applyFilters();
}

// ======================================================
// 4. AGREGAR AL CARRITO (POST & MODAL)
// ======================================================

// Helper para Modal Bootstrap
function mostrarModalBootstrap({ title, text, imageUrl, confirmText, cancelText }) {
    const modalEl = document.getElementById('modalWoof');
    if(!modalEl) { alert(text); return; }

    document.getElementById('modalTitulo').innerText = title;
    document.getElementById('modalMensaje').innerText = text;
    
    const imgEl = document.getElementById('modalImagen');
    if (imageUrl) {
        imgEl.src = imageUrl;
        imgEl.classList.remove('d-none');
    } else {
        imgEl.classList.add('d-none');
    }

    const btnConfirm = document.getElementById('btnConfirmar');
    const btnCancel = document.getElementById('btnCancelar');
    
    if(btnConfirm) btnConfirm.innerText = confirmText;
    
    if(btnCancel) {
        btnCancel.innerText = cancelText || "Cancelar";
        btnCancel.classList.remove('d-none');
    }

    const modal = new bootstrap.Modal(modalEl);
    
    // Sobrescribir evento confirmar para ocultar
    btnConfirm.onclick = () => {
        modal.hide();
    };

    modal.show();
}

window.agregarAlCarrito = async function(idProducto) {
    const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));
    
    if (!usuarioLogueado) {
        mostrarModalBootstrap({
            title: "Inicia Sesión",
            text: "Para agregar productos a tu carrito, necesitas ingresar a tu cuenta.",
            confirmText: "Ir al Login",
            cancelText: "Cancelar"
        });
        
        // Sobrescribir botón confirmar
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
            // Buscar info del producto (para la foto)
            const productoInfo = listaDeProductos.find(p => p.idProducto === idProducto);
            let rutaImg = productoInfo ? (productoInfo.imagenUrl || productoInfo.imageURL) : null;
            if(rutaImg && rutaImg.trim() === '') rutaImg = null;

            mostrarModalBootstrap({
                title: "¡Producto Agregado!",
                text: `${productoInfo ? productoInfo.nombre : 'Producto'} se añadió a tu carrito.`,
                imageUrl: rutaImg,
                confirmText: "Seguir comprando",
                cancelText: "Ir al carrito"
            });
            
            // Botón secundario -> ir al carrito
            const btnCancel = document.getElementById('btnCancelar');
            if(btnCancel) {
                btnCancel.onclick = () => window.location.href = 'carrito.html';
            }
            
            // Actualizar badge
            if(window.actualizarBadgeNavbar) window.actualizarBadgeNavbar();
            
        } else {
            console.error("Error server:", await res.text());
            mostrarModalBootstrap({ title: 'Error', text: 'No se pudo agregar el producto. Intenta de nuevo.' });
        }
    } catch(e) { 
        console.error(e); 
        mostrarModalBootstrap({ title: 'Error', text: 'Error de conexión con el servidor.' });
    }
};

// ======================================================
// 5. INICIALIZACIÓN
// ======================================================
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos(); 
    
    // Eventos Filtros (Buscador)
    if(searchInput) searchInput.addEventListener('keyup', applyFilters);
    
    // Eventos Filtros (Radio Buttons)
    if(filtersForm) {
        filtersForm.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', applyFilters);
        });
    }

    // Sincronizar badge al entrar
    if (typeof window.actualizarBadgeNavbar === 'function') {
        window.actualizarBadgeNavbar();
    }
});