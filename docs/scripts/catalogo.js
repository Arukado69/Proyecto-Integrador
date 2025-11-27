// --- CONFIGURACIÓN BACKEND ---
const API_URL = 'http://localhost:8080/api/v1'; // Ajustado a tu ruta real v1

// ------- Variables Globales -------
let listaDeProductos = [];
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
        const response = await fetch(`${API_URL}/productos`); // GET a Spring Boot
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
    // 1. Necesitamos el ID del Usuario (sacado del Login)
    const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));

    if (!usuarioLogueado) {
        alert("Debes iniciar sesión para comprar.");
        window.location.href = "iniciosesion.html";
        return;
    }

    try {
        // 2. Enviar al Backend (CarritoController)
        const response = await fetch(`${API_URL}/carrito/agregar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                idUsuario: usuarioLogueado.id, // ID del usuario real
                idProducto: idProducto,        // ID del producto clickeado
                cantidad: 1 
            })
        });

        if (response.ok) {
            // Buscar datos visuales para el modal
            // Nota: Aquí usamos 'idProducto' porque así viene de Java
            const productoInfo = listaDeProductos.find(p => p.idProducto === idProducto);
            
            mostrarModalBootstrap({
                title: '¡Al carrito!',
                text: `${productoInfo ? productoInfo.nombre : 'Producto'} guardado en tu carrito.`,
                imageUrl: productoInfo ? productoInfo.imagenUrl : '',
                confirmText: 'Seguir comprando',  
                cancelText: 'Ir al carrito'       
            });

            document.getElementById('btnCancelar').onclick = function() {
                window.location.href = 'carrito.html'; 
            };

        } else {
            console.error("Error server:", await response.text());
            alert("Error al agregar al carrito.");
        }
    } catch (e) {
        console.error("Error:", e);
        alert("Error de conexión con el servidor.");
    }
};

// ======================================================
// 3. RENDERIZADO Y FILTROS (Visual)
// ======================================================

function createProductCard(item) {
  // CORRECCIÓN: Usamos las propiedades en Español del Backend Java
  const { idProducto, nombre, precio, imagenUrl, descripcion, sabor, tamano, categoria } = item;
  
  return `
    <div class="col d-flex">
      <div class="card card-producto rounded-5 shadow-sm hover-zoom w-100">
        <img src="${imagenUrl}" class="catalogo-img-size rounded-top-5" alt="${nombre}"
             onerror="this.src='../assets/imagenes/iconos/logo-default.png'">
        <div class="card-body text-center">
          <h5 class="card-title catalogo-roboto-h4 mb-1">${nombre}</h5>
          <p class="text-muted small mb-2 text-truncate" title="${descripcion}">${descripcion || ''}</p>
          
          <ul class="list-unstyled small text-muted mb-3">
             ${sabor ? `<li><b>Sabor:</b> ${sabor}</li>` : ''}
             ${tamano ? `<li><b>Tamaño:</b> ${tamano}</li>` : ''}
             ${categoria ? `<li><b>Categoría:</b> ${categoria}</li>` : ''}
          </ul>
          
          <h4 class="catalogo-price-color catalogo-roboto-h4 mb-3">$${precio}</h4>
          
          <button class="btn rounded-4 catalogo-secundary-button-color catalogo-roboto-primary-label w-100 mt-auto" 
                  onclick="window.agregarAlCarrito(${idProducto})">
              Añadir al carrito
          </button>
        </div>
      </div>
    </div>`;
}

function renderPage(page = 1) {
  if (listaDeProductos.length === 0) {
      productRow.innerHTML = `<div class="col-12 text-center py-5"><p>No hay productos disponibles por el momento.</p></div>`;
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
  if(total > ITEMS_PER_PAGE){
      let html = `<nav><ul class="pagination justify-content-center">`;
      // Botón Anterior
      html += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                 <button class="page-link" onclick="renderPage(${currentPage - 1})">Anterior</button>
               </li>`;
      // Botón Siguiente
      html += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                 <button class="page-link" onclick="renderPage(${currentPage + 1})">Siguiente</button>
               </li>`;
      html += `</ul></nav>`;
      paginationEl.innerHTML = html;
  } else {
      paginationEl.innerHTML = '';
  }
}

function applyFilters() {
  const term = (searchInput.value || '').trim().toLowerCase();
  
  // Obtener valores de radio buttons seleccionados
  const selectedFlavor = document.querySelector('input[name="flavor"]:checked')?.value || "";
  const selectedCategory = document.querySelector('input[name="category"]:checked')?.value || "";
  const selectedSize = document.querySelector('input[name="size"]:checked')?.value || "";

  filtered = listaDeProductos.filter(p => {
      // Filtro por Nombre
      const matchName = !term || p.nombre.toLowerCase().includes(term);
      
      // Filtro por Sabor (Si p.sabor es null, usamos string vacío para no romper)
      const matchFlavor = !selectedFlavor || (p.sabor && p.sabor.includes(selectedFlavor));
      
      // Filtro por Categoría
      const matchCategory = !selectedCategory || (p.categoria && p.categoria === selectedCategory);
      
      // Filtro por Tamaño
      const matchSize = !selectedSize || (p.tamano && p.tamano === selectedSize);

      return matchName && matchFlavor && matchCategory && matchSize;
  });
  renderPage(1);
}

// ======================================================
// 4. INICIALIZACIÓN
// ======================================================
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos(); 
    
    // Listeners
    searchInput.addEventListener('keyup', applyFilters);
    applyBtn.addEventListener('click', applyFilters);
    filtersForm.querySelectorAll('input[type="radio"]').forEach(r => r.addEventListener('change', applyFilters));
});