// --- CONFIGURACIÓN BACKEND ---
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
            applyFilters(); 
        } else {
            productRow.innerHTML = '<div class="col-12 text-center"><p>No se pudo cargar el inventario.</p></div>';
        }
    } catch (e) {
        console.error("Error:", e);
        productRow.innerHTML = '<div class="col-12 text-center text-danger"><p>Error de conexión con el servidor.</p></div>';
    }
}

// ======================================================
// 2. LÓGICA DE FILTROS (MEJORADA Y ROBUSTA)
// ======================================================

function applyFilters() {
  // 1. Obtenemos valores de los inputs (y los pasamos a minúsculas para evitar errores)
  const term = (searchInput.value || '').trim().toLowerCase();
  
  const rawFlavor = document.querySelector('input[name="flavor"]:checked')?.value || "";
  const rawCategory = document.querySelector('input[name="category"]:checked')?.value || "";
  const rawSize = document.querySelector('input[name="size"]:checked')?.value || "";

  // Convertimos los filtros seleccionados a minúsculas
  const selectedFlavor = rawFlavor.toLowerCase();
  const selectedCategory = rawCategory.toLowerCase();
  const selectedSize = rawSize.toLowerCase();

  console.log("Filtros activos:", { term, selectedFlavor, selectedCategory, selectedSize });

  // 2. Filtramos la lista
  filtered = listaDeProductos.filter(p => {
      // Datos del producto (protegidos contra nulos y pasados a minúsculas)
      const pNombre = (p.nombre || '').toLowerCase();
      const pSabor  = (p.sabor || '').toLowerCase();
      const pCat    = (p.categoria || '').toLowerCase();
      const pTamano = (p.tamano || '').toLowerCase();

      // A) Filtro Nombre (Búsqueda parcial)
      const matchName = !term || pNombre.includes(term);
      
      // B) Filtro Sabor (Búsqueda parcial por si dice "Pollo y Arroz")
      const matchFlavor = !selectedFlavor || pSabor.includes(selectedFlavor);
      
      // C) Filtro Categoría (Búsqueda exacta o parcial flexible)
      const matchCategory = !selectedCategory || pCat === selectedCategory || pCat.includes(selectedCategory);
      
      // D) Filtro Tamaño (Exacto o parcial)
      const matchSize = !selectedSize || pTamano === selectedSize || pTamano.includes(selectedSize);

      return matchName && matchFlavor && matchCategory && matchSize;
  });

  // 3. Renderizar desde la página 1
  renderPage(1);
}

// ======================================================
// 3. RENDERIZADO (Cards)
// ======================================================

function createProductCard(item) {
  // Desestructuramos propiedades del Backend (Español)
  const { idProducto, nombre, precio, imagenUrl, descripcion, sabor, tamano, categoria } = item;
  
  // Fallback de imagen
  const imgFinal = imagenUrl || '../assets/imagenes/iconos/logo-default.png';

  return `
    <div class="col d-flex">
      <div class="card card-producto rounded-5 shadow-sm hover-zoom w-100">
        <img src="${imgFinal}" class="catalogo-img-size rounded-top-5" alt="${nombre}" 
             onerror="this.src='../assets/imagenes/iconos/logo-default.png'">
        
        <div class="card-body text-center d-flex flex-column">
          <h5 class="card-title catalogo-roboto-h4 mb-1 text-truncate" title="${nombre}">${nombre}</h5>
          <p class="text-muted small mb-2 text-truncate">${descripcion || ''}</p>
          
          <ul class="list-unstyled small text-muted mb-3">
             ${sabor ? `<li><b>Sabor:</b> ${sabor}</li>` : ''}
             ${tamano ? `<li><b>Tamaño:</b> ${tamano}</li>` : ''}
             ${categoria ? `<li><b>Categoría:</b> ${categoria}</li>` : ''}
          </ul>
          
          <h4 class="catalogo-price-color catalogo-roboto-h4 mb-3">$${precio.toFixed(2)}</h4>
          
          <button class="btn rounded-4 catalogo-secundary-button-color catalogo-roboto-primary-label w-100 mt-auto" 
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
            <p class="fs-4 text-muted">🐶</p>
            <p class="text-muted">No encontramos productos con esos filtros.</p>
            <button class="btn btn-outline-warning btn-sm" onclick="limpiarFiltros()">Ver todo</button>
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
               <button class="page-link" onclick="renderPage(${currentPage - 1})">Anterior</button>
            </li>
            <li class="page-item disabled d-none d-md-block"><span class="page-link border-0">Página ${currentPage} de ${totalPages}</span></li>
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
               <button class="page-link" onclick="renderPage(${currentPage + 1})">Siguiente</button>
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
    if(filtersForm) filtersForm.reset();
    if(searchInput) searchInput.value = '';
    applyFilters();
}

// ======================================================
// 4. AGREGAR AL CARRITO
// ======================================================

window.agregarAlCarrito = async function(idProducto) {
    const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));
    
    if (!usuarioLogueado) {
        // Opción: Mandar alerta o redirigir
        if(confirm("Necesitas iniciar sesión para comprar. ¿Ir al login?")) {
            window.location.href = "iniciosesion.html";
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
            // Mostrar Modal Bonito (Bootstrap) si existe en el HTML
            mostrarModalBootstrap({
                title: "¡Producto agregado!",
                text: "Se añadió correctamente a tu carrito.",
                confirmText: "Seguir comprando",
                cancelText: "Ir al carrito"
            });
            
            // Actualizar el badge del navbar si existe la función
            if(window.actualizarBadgeNavbar) window.actualizarBadgeNavbar();
            
        } else {
            alert("Error al agregar producto.");
        }
    } catch(e) { 
        console.error(e); 
        alert("Error de conexión.");
    }
};

// Helper para el Modal (Reutiliza tu modal del HTML)
function mostrarModalBootstrap({ title, text, confirmText, cancelText }) {
    const modalEl = document.getElementById('modalWoof');
    if(!modalEl) { alert(text); return; } // Fallback si no hay modal

    document.getElementById('modalTitulo').innerText = title;
    document.getElementById('modalMensaje').innerText = text;
    
    const btnConfirm = document.getElementById('btnConfirmar');
    const btnCancel = document.getElementById('btnCancelar');
    
    if(btnConfirm) {
        btnConfirm.innerText = confirmText;
        btnConfirm.onclick = () => bootstrap.Modal.getInstance(modalEl).hide();
    }
    if(btnCancel) {
        btnCancel.innerText = cancelText;
        btnCancel.onclick = () => window.location.href = 'carrito.html';
    }

    const modal = new bootstrap.Modal(modalEl);
    modal.show();
}


// ======================================================
// 5. INICIALIZACIÓN
// ======================================================
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos(); 
    
    // Eventos de Filtros
    if(searchInput) searchInput.addEventListener('keyup', applyFilters);
    if(applyBtn) applyBtn.addEventListener('click', applyFilters);
    
    // Detectar cambio en los radio buttons automáticamente
    if(filtersForm) {
        filtersForm.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', applyFilters);
        });
    }
});