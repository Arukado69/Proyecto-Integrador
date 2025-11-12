// scripts/formulario-productos.js
(function () {
  const $ = (sel) => document.querySelector(sel);

  const form = $('#formProducto');
  const alerta = $('#alerta');
  const jsonPreview = $('#jsonPreview');

  const nombre = $('#nombre');
  const precio = $('#precio');
  const descripcion = $('#descripcion');
  const tamano = $('#tamano');
  const sabor = $('#sabor');
  const categoria = $('#categoria');
  const imagen = $('#imagen');
  const stock = $('#stock');
  const sku = $('#sku');
  const descuento = $('#descuento');
  const btnLimpiar = $('#btnLimpiar');

  // Sugiere nombre tipo "Menú de Pollo 500g" si está vacío
  function autocompletarNombre() {
    if (!nombre.value.trim() && sabor.value && tamano.value) {
      nombre.value = `Menú de ${sabor.value} ${tamano.value}`;
    }
  }
  sabor.addEventListener('change', autocompletarNombre);
  tamano.addEventListener('change', autocompletarNombre);

  function showAlert(tipo, mensaje) {
    alerta.className = `alert alert-${tipo}`;
    alerta.textContent = mensaje;
    alerta.classList.remove('d-none');
  }

  function hideAlert() {
    alerta.classList.add('d-none');
  }

  function leerLocalNuevos() {
    try {
      return JSON.parse(localStorage.getItem('productosNuevos') || '[]');
    } catch { return []; }
  }

  function guardarLocalNuevos(arr) {
    localStorage.setItem('productosNuevos', JSON.stringify(arr));
  }

  function getNextId() {
    const base = Array.isArray(window.listaDeProductos) ? window.listaDeProductos : [];
    const nuevos = leerLocalNuevos();
    const ids = [...base, ...nuevos]
      .map(p => Number(p.id))
      .filter(n => Number.isFinite(n));
    const max = ids.length ? Math.max(...ids) : 0;
    return max + 1;
  }

  function validarURL(url) {
    try { new URL(url, window.location.origin); return true; }
    catch { return false; }
  }

  function buildProducto() {
    return {
      id: getNextId(),
      name: nombre.value.trim(),
      price: Number(precio.value),
      description: descripcion.value.trim(),
      imageURL: imagen.value.trim(),

      // Campos adicionales (no usados por las cards, pero útiles)
      size: tamano.value,
      flavor: sabor.value,
      category: categoria.value,
      stock: Number(stock.value || 0),
      sku: sku.value.trim() || `WBF-${Date.now().toString().slice(-5)}`,
      discount: Number(descuento.value || 0),
      createdAt: new Date().toISOString()
    };
  }

  function validarFormulario() {
    // Bootstrap validation UI
    form.classList.add('was-validated');
    let ok = true;

    if (!nombre.value.trim()) ok = false;
    if (!precio.value || Number(precio.value) <= 0) ok = false;
    if (!descripcion.value.trim()) ok = false;
    if (!tamano.value) ok = false;
    if (!sabor.value) ok = false;
    if (!categoria.value) ok = false;
    if (!imagen.value.trim() || !validarURL(imagen.value.trim())) ok = false;

    return ok;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    hideAlert();

    if (!validarFormulario()) {
      showAlert('danger', 'Revisa los campos marcados. Faltan datos o hay valores inválidos.');
      return;
    }

    const nuevo = buildProducto();

    // Empuja al arreglo global (memoria de esta pestaña)
   // dentro del submit, después de construir 'nuevo':
if (typeof listaDeProductos !== 'undefined' && Array.isArray(listaDeProductos)) {
  listaDeProductos.push(nuevo);
} else {
  console.warn('formulario: listaDeProductos no disponible en este contexto; producto guardado solo en localStorage.');
}


    // Persiste para que el catálogo lo lea y lo muestre
    const guardados = leerLocalNuevos();
    guardados.push(nuevo);
    guardarLocalNuevos(guardados);

    // Vista previa JSON
    jsonPreview.textContent = JSON.stringify(nuevo, null, 2);

    showAlert('success', 'Producto agregado correctamente. Puedes abrir la Tienda para verlo.');
    form.reset();
    form.classList.remove('was-validated');
  });

  btnLimpiar.addEventListener('click', () => {
    form.reset();
    form.classList.remove('was-validated');
    jsonPreview.textContent = '—';
    hideAlert();
  });
})();
