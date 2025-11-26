// 1. IMPORTS
// import { listaDeProductos } from '/scripts/productos.js';  //ya no cargar base de datos local

// ------- Config -------
const ITEMS_PER_PAGE = 6;

// ------- DOM -------
const productRow   = document.getElementById('product-row');
const paginationEl = document.getElementById('pagination-container');
const resultsInfo  = document.getElementById('results-info');
const searchInput  = document.getElementById('searchInput');
const applyBtn     = document.getElementById('applyFiltersBtn');
const filtersForm  = document.getElementById('filtersForm');

// ------- Estado -------
let currentPage = 1;
let filtered = [...listaDeProductos]; 

// ======================================================
// A. UTILIDADES: MODAL BOOTSTRAP Y CARRITO
// ======================================================

let modalInstancia = null; 

// 1. Función para mostrar el Modal
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

// 2. Función Global para AGREGAR (Conectada al botón)
window.agregarAlCarrito = function(idProducto) {
    const CLAVE_CARRITO = 'carritoWoofBarf';
    let carrito = JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
    
    const productoInfo = listaDeProductos.find(p => p.id === idProducto);

    if (!productoInfo) {
        console.error("Producto no encontrado ID:", idProducto);
        return;
    }

    const itemExistente = carrito.find(item => item.id === idProducto);

    if (itemExistente) {
        itemExistente.cantidad++;
        
        mostrarModalBootstrap({
            title: '¡Sumado!',
            text: `Agregamos otra unidad de ${productoInfo.name} a tu carrito.`,
            confirmText: 'Seguir viendo'
        });

    } else {
        carrito.push({ ...productoInfo, cantidad: 1 });
        
        const rutaImg = productoInfo.imageURL.replace('..', ''); 

        mostrarModalBootstrap({
            title: '¡Al carrito!',
            text: `${productoInfo.name} se agregó exitosamente. ¿Qué deseas hacer?`,
            imageUrl: rutaImg,
            confirmText: 'Seguir comprando',  
            cancelText: 'Ir al carrito'       
        });

        document.getElementById('btnCancelar').onclick = function() {
            window.location.href = '/pages/carrito.html'; 
        };
    }

    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));

    // Actualizamos el badge del navbar inmediatamente después de guardar
    if (typeof window.actualizarBadgeNavbar === 'function') {
        window.actualizarBadgeNavbar();
    }
};


// ======================================================
// B. RENDERIZADO DE TARJETAS
// ======================================================

function createProductCard(item) {
  const { id, name, price, imageURL, description, flavor, size, category } = item;

  return `
    <div class="col d-flex">
      <div class="card card-producto rounded-5 shadow-sm hover-zoom w-100">
        <img src="${imageURL}" class="catalogo-img-size rounded-top-5" alt="${name}">
        <div class="card-body text-center">
          <h5 class="card-title catalogo-roboto-h4 mb-1">${name}</h5>
          <p class="text-muted small mb-2">${description || ''}</p>

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
    </div>
  `;
}

// ======================================================
// C. PAGINACIÓN Y RENDER
// ======================================================

function renderPage(page = 1) {
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  currentPage = Math.min(Math.max(1, page), totalPages);

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = Math.min(start + ITEMS_PER_PAGE, total);

  const cardsHTML = filtered.slice(start, end).map(createProductCard).join('');
  
  productRow.innerHTML = cardsHTML;

  resultsInfo.textContent = total
    ? `Mostrando ${start + 1}–${end} de ${total} productos`
    : 'No hay resultados para los filtros aplicados.';

  let html = `
    <nav aria-label="Paginación">
      <ul class="pagination justify-content-center">
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
          <a class="page-link" href="#" data-page="${currentPage - 1}">Anterior</a>
        </li>`;
  for (let p = 1; p <= totalPages; p++) {
    html += `
      <li class="page-item ${currentPage === p ? 'active' : ''}">
        <a class="page-link" href="#" data-page="${p}">${p}</a>
      </li>`;
  }
  html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
          <a class="page-link" href="#" data-page="${currentPage + 1}">Siguiente</a>
        </li>
      </ul>
    </nav>`;
  paginationEl.innerHTML = html;

  paginationEl.querySelectorAll('a.page-link').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const page = Number(a.dataset.page);
      if (!Number.isNaN(page)) {
        renderPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
}

// ======================================================
// D. FILTROS
// ======================================================

function getRadioValue(name) {
  const el = filtersForm.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : '';
}

function applyFilters() {
  const term     = (searchInput.value || '').trim().toLowerCase();
  const flavor = getRadioValue('flavor'); 
  const size   = getRadioValue('size');   
  const category  = getRadioValue('category'); 

  filtered = listaDeProductos.filter(p => {
    const okTerm = !term ||
      (p.name && p.name.toLowerCase().includes(term)) ||
      (p.description && p.description.toLowerCase().includes(term));

    const okFlavor = !flavor || (p.flavor && p.flavor.toLowerCase() === flavor.toLowerCase());
    const okSize = !size || (p.size && p.size.toLowerCase() === size.toLowerCase());
    const okCategory = !category ||
      (p.category && p.category.toLowerCase() === category.toLowerCase());

    return okTerm && okFlavor && okSize && okCategory;
  });

  renderPage(1);
}

// Listeners Filtros
searchInput.addEventListener('keyup', applyFilters);
applyBtn.addEventListener('click', applyFilters);
filtersForm.querySelectorAll('input[type="radio"]').forEach(r => r.addEventListener('change', applyFilters));

// Init
applyFilters();

// --- AQUÍ ESTÁ LA MAGIA (2/2) ---
// Sincronizar badge al cargar la página por primera vez
// (Por si vienes del carrito con productos ya comprados)
if (typeof window.actualizarBadgeNavbar === 'function') {
    window.actualizarBadgeNavbar();
}