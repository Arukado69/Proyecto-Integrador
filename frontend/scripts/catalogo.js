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
let filtered = [...listaDeProductos]; // viene de productos.js

// ------- Render card -------
function createProductCard(item) {
  const { name, price, imageURL, description, flavor, size, category } = item;

  return `
    <div class="col d-flex">
      <div class="card rounded-5 shadow-sm hover-zoom w-100">
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
          <button class="btn rounded-4 catalogo-secundary-button-color catalogo-roboto-primary-label">Añadir al carrito</button>
        </div>
      </div>
    </div>
  `;
}

// ------- Paginación y render -------
function renderPage(page = 1) {
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  currentPage = Math.min(Math.max(1, page), totalPages);

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = Math.min(start + ITEMS_PER_PAGE, total);

  productRow.innerHTML = filtered.slice(start, end).map(createProductCard).join('');

  // Indicador
  resultsInfo.textContent = total
    ? `Mostrando ${start + 1}–${end} de ${total} productos`
    : 'No hay resultados para los filtros aplicados.';

  // Controles
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

// ------- Filtros -------
function getRadioValue(name) {
  const el = filtersForm.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : '';
}

function applyFilters() {
  const term   = (searchInput.value || '').trim().toLowerCase();
  const flavor = getRadioValue('flavor'); // '' = Todos
  const size   = getRadioValue('size');   // '' = Todos

  filtered = listaDeProductos.filter(p => {
    // texto
    const okTerm = !term ||
      (p.name && p.name.toLowerCase().includes(term)) ||
      (p.description && p.description.toLowerCase().includes(term));

    // sabor
    const okFlavor = !flavor || (p.flavor && p.flavor.toLowerCase() === flavor.toLowerCase());

    // tamaño
    const okSize = !size || (p.size && p.size.toLowerCase() === size.toLowerCase());

    return okTerm && okFlavor && okSize;
  });

  renderPage(1);
}

// Live search + botones
searchInput.addEventListener('keyup', applyFilters);
applyBtn.addEventListener('click', applyFilters);
filtersForm.querySelectorAll('input[type="radio"]').forEach(r => r.addEventListener('change', applyFilters));

// Init
applyFilters();
