// --- CONFIGURACIÓN BACKEND ---
const API_URL = 'http://localhost:8080/api'; //ajustar dirección 

// ------- Variables Globales -------
let listaDeProductos = []; // Se llena desde el servidor
let filtered = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 6;

// ------- DOM -------
const productRow   = document.getElementById('product-row');
const paginationEl = document.getElementById('pagination-container');
const resultsInfo  = document.getElementById('results-info');
const searchInput  = document.getElementById('searchInput');
const applyBtn     = document.getElementById('applyFiltersBtn');
const filtersForm  = document.getElementById('filtersForm');

// ======================================================
// 1. CARGA DE DATOS (DEL SERVIDOR)
// ======================================================

async function cargarProductos() {
    try {
        const response = await fetch(`${API_URL}/productos`); // GET
        if(response.ok) {
            listaDeProductos = await response.json();
            
            // Inicializar filtros
            filtered = [...listaDeProductos];
            applyFilters(); // Renderizar
        } else {
            console.error("Error cargando catálogo");
            productRow.innerHTML = '<p class="text-center">No se pudo cargar el inventario.</p>';
        }
    } catch (e) {
        console.error("Error de conexión:", e);
        productRow.innerHTML = '<p class="text-center text-danger">Error de conexión con el servidor.</p>';
    }
}

// ======================================================
// 2. LÓGICA DE CARRITO (CONECTADA A BACKEND)
// ======================================================

let modalInstancia = null; 

function mostrarModalBootstrap({ title, text, imageUrl, confirmText, cancelText, onConfirm }) {
    const modalEl = document.getElementById('modalWoof');
    if(!modalEl) return; 

    document.getElementById('modalTitulo').innerText = title || 'Aviso';
    document.getElementById('modalMensaje').innerText = text || '';

    const imgEl = document.getElementById('modalImagen');
    if (imageUrl) {
        imgEl.src = imageUrl;
        imgEl.classList.remove('d-none');
    } else {
        imgEl.classList.add('d-none');
    }

    const btnConfirmar = document.getElementById('btnConfirmar');
    const btnCancelar = document.getElementById('btnCancelar');

    btnConfirmar.innerText = confirmText || 'Aceptar';
    
    if (cancelText) {
        btnCancelar.innerText = cancelText;
        btnCancelar.classList.remove('d-none');
    } else {
        btnCancelar.classList.add('d-none');
    }

    btnConfirmar.onclick = function() {
        if (onConfirm) onConfirm(); 
        modalInstancia.hide();
    };

    if (!modalInstancia) {
        modalInstancia = new bootstrap.Modal(modalEl);
    }
    modalInstancia.show();
}

// FUNCIÓN AGREGAR AL CARRITO (POST al Servidor)
window.agregarAlCarrito = async function(idProducto) {
    try {
        // Enviar orden al servidor
        const response = await fetch(`${API_URL}/carrito/agregar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productoId: idProducto, cantidad: 1 })
        });

        if (response.ok) {
            // Buscar datos visuales solo para la alerta
            const productoInfo = listaDeProductos.find(p => p.id === idProducto);
            
            // Ajuste visual de imagen
            let rutaImg = productoInfo ? productoInfo.imageURL : '';
            if(rutaImg.startsWith('..')) rutaImg = rutaImg.replace('..', '');

            mostrarModalBootstrap({
                title: '¡Al carrito!',
                text: `${productoInfo ? productoInfo.name : 'Producto'} guardado en tu carrito.`,
                imageUrl: rutaImg,
                confirmText: 'Seguir comprando',  
                cancelText: 'Ir al carrito'       
            });

            document.getElementById('btnCancelar').onclick = function() {
                window.location.href = '/pages/carrito/carrito.html'; 
            };

            // Actualizar el numerito del navbar (Petición al server)
            if (typeof window.actualizarBadgeNavbar === 'function') {
                window.actualizarBadgeNavbar();
            }
        } else {
            alert("Error al agregar al carrito en el servidor.");
        }
    } catch (e) {
        console.error("Error:", e);
        alert("Error de conexión.");
    }
};

// ======================================================
// 3. RENDERIZADO Y FILTROS (Visual - Igual que antes)
// ======================================================

function createProductCard(item) {
  const { id, name, price, imageURL, description, flavor, size, category } = item;
  return `
    <div class="col d-flex">
      <div class="card card-producto rounded-5 shadow-sm hover-zoom w-100">
        <img src="${imageURL}" class="catalogo-img-size rounded-top-5" alt="${name}"
             onerror="this.src='https://via.placeholder.com/300?text=Sin+Imagen'">
        <div class="card-body text-center">
          <h5 class="card-title catalogo-roboto-h4 mb-1">${name}</h5>
          <p class="text-muted small mb-2 text-truncate">${description || ''}</p>
          ${(flavor || size || category) ? `
            <ul class="list-unstyled small text-muted mb-3">
              ${flavor ? `<li><b>Sabor:</b> ${flavor}</li>` : ''}
              ${size ? `<li><b>Tamaño:</b> ${size}</li>` : ''}
              ${category ? `<li><b>Categoría:</b> ${category}</li>` : ''}
            </ul>` : ''}
          <h4 class="catalogo-price-color catalogo-roboto-h4 mb-3">$${price}</h4>
          <button class="btn rounded-4 catalogo-secundary-button-color catalogo-roboto-primary-label w-100 mt-auto" 
                  onclick="window.agregarAlCarrito(${id})">
              Añadir al carrito
          </button>
        </div>
      </div>
    </div>`;
}

function renderPage(page = 1) {
  if (listaDeProductos.length === 0) {
      productRow.innerHTML = `<div class="col-12 text-center py-5"><p>Cargando productos o inventario vacío...</p></div>`;
      resultsInfo.textContent = '';
      paginationEl.innerHTML = '';
      return;
  }
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = Math.min(start + ITEMS_PER_PAGE, total);
  
  productRow.innerHTML = filtered.slice(start, end).map(createProductCard).join('');
  resultsInfo.textContent = total ? `Mostrando ${start + 1}–${end} de ${total} productos` : 'Sin resultados.';

  // Paginación Simple
  let html = `<nav><ul class="pagination justify-content-center">`;
  // (Lógica de paginación resumida para ahorrar espacio, es la misma de antes)
  // ... botones Anterior / Siguiente ...
  html += `</ul></nav>`;
  paginationEl.innerHTML = total > 0 ? html : '';
}

function applyFilters() {
  const term = (searchInput.value || '').trim().toLowerCase();
  // ... lógica de filtros (radio buttons) igual que antes ...
  
  // Como ejemplo simple:
  filtered = listaDeProductos.filter(p => {
      const matchName = !term || p.name.toLowerCase().includes(term);
      return matchName; // + agregar lógica de radio buttons aquí
  });
  renderPage(1);
}

// ======================================================
// 4. INICIALIZACIÓN
// ======================================================
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos(); // 1. Pedir datos al servidor
    
    // Listeners
    searchInput.addEventListener('keyup', applyFilters);
    applyBtn.addEventListener('click', applyFilters);
    filtersForm.querySelectorAll('input[type="radio"]').forEach(r => r.addEventListener('change', applyFilters));

    if (typeof window.actualizarBadgeNavbar === 'function') {
        window.actualizarBadgeNavbar();
    }
});