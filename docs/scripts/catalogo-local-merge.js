// scripts/catalogo_local_merge.js (corregido)
(() => {
  try {
    const guardados = JSON.parse(localStorage.getItem('productosNuevos') || '[]');
    if (!Array.isArray(guardados) || guardados.length === 0) return;

    // Asegurarnos de que el arreglo base exista
    if (typeof listaDeProductos === 'undefined' || !Array.isArray(listaDeProductos)) {
      console.warn('catalogo_local_merge: listaDeProductos no está disponible.');
      return;
    }

    const existentes = new Set(listaDeProductos.map(p => Number(p.id)));
    for (const p of guardados) {
      const pid = Number(p.id);
      if (!existentes.has(pid)) {
        listaDeProductos.push(p);
      }
    }
    // listo: ahora catalogo.js (que corre después) verá los productos fusionados
  } catch (e) {
    console.error('Error al fusionar productos de localStorage:', e);
  }
})();
