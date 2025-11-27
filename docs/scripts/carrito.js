// --- CONFIGURACIÓN BACKEND ---
const API_URL = 'http://localhost:8080/api/v1'; 

// Variable Global para guardar los datos
let carritoActual = { detalles: [], total: 0 }; 

// ==========================================
// A. CARGA DE DATOS (GET del Servidor)
// ==========================================

async function cargarCarritoDelServidor() {
    const contenedorItems = document.getElementById('listaItems');
    const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));

    // 1. Verificar si hay usuario logueado
    if (!usuarioLogueado) {
        window.location.href = "iniciosesion.html";
        return;
    }

    try {
        // 2. Pedir carrito al Backend usando el ID del usuario
        const response = await fetch(`${API_URL}/carrito/usuario/${usuarioLogueado.id}`);
        
        if (response.ok) {
            carritoActual = await response.json();
            
            // 3. Renderizar (Pasamos la lista de detalles, no el objeto entero)
            renderizarCarritoUI(carritoActual.detalles || []);
            actualizarTotales(carritoActual);
        } else {
            console.error("Error al cargar carrito");
            contenedorItems.innerHTML = '<p class="text-center">No se pudo cargar tu carrito.</p>';
        }
    } catch (e) {
        console.error("Error de conexión:", e);
        contenedorItems.innerHTML = '<p class="text-center">Error de conexión con el servidor.</p>';
    }
}

// ==========================================
// B. RENDERIZADO (Visual)
// ==========================================

function renderizarCarritoUI(detalles) {
    const contenedorItems = document.getElementById('listaItems');
    const estadoVacio = document.getElementById('estadoVacio');
    const actionsBar = document.getElementById('actionsBar');

    // 1. Manejo de estado vacío
    if (!detalles || detalles.length === 0) {
        if(estadoVacio) estadoVacio.classList.remove('d-none');
        if(contenedorItems) contenedorItems.innerHTML = '';
        if(actionsBar) actionsBar.classList.add('d-none');
        actualizarTotales({ total: 0 }); // Resetear totales
        return;
    }

    // 2. Si hay productos, mostramos la lista
    if(estadoVacio) estadoVacio.classList.add('d-none');
    if(actionsBar) actionsBar.classList.remove('d-none');

    contenedorItems.innerHTML = '';
    
    // 3. Crear las cards (Adaptado a la estructura de Java)
    detalles.forEach(detalle => {
        // En Java: detalle -> producto -> nombre
        const producto = detalle.producto; 
        
        // Calcular total de esta línea (precio * cantidad)
        // Nota: Tu backend ya te da 'subtotal' calculado, úsalo si prefieres
        const totalItem = detalle.subtotal; 
        
        let rutaImg = producto.imagenUrl || 'https://via.placeholder.com/80';

        const htmlItem = `
            <div class="card shadow-sm border-light mb-2"> 
                <div class="card-body p-3">
                    <div class="row align-items-center g-3">
                        <div class="col-4 col-md-2 text-center">
                            <img src="${rutaImg}" alt="${producto.nombre}" class="img-fluid rounded" 
                                 style="max-height: 80px;" onerror="this.src='../assets/imagenes/iconos/logo-default.png'">
                        </div>
                        
                        <div class="col-8 col-md-4">
                            <h6 class="fw-bold text-dark mb-1 text-truncate">${producto.nombre}</h6>
                            <small class="text-muted d-block">Sabor: ${producto.sabor || 'N/A'}</small>
                            <small class="text-muted">Tamaño: ${producto.tamano || 'Unitalla'}</small>
                        </div>
                        
                        <div class="col-6 col-md-3 d-flex justify-content-center">
                            <span class="fw-bold">Cant: ${detalle.cantidad}</span>
                        </div>
                        
                        <div class="col-6 col-md-3 text-end">
                            <div class="fw-bold text-primary mb-1">$${totalItem.toFixed(2)}</div>
                            <button class="btn btn-link text-danger p-0 small" onclick="window.eliminarItem(${detalle.idCarritoDetalle})">
                                <i class="bi bi-trash3"></i> Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
        contenedorItems.innerHTML += htmlItem;
    });
}

function actualizarTotales(carrito) {
    // 1. Obtenemos el subtotal que viene calculado desde Java
    const subtotal = carrito.total || 0;
    
    // 2. REGLA DE NEGOCIO: Envío gratis a partir de $499
    let costoEnvio = 99.00; // Precio base
    
    if (subtotal >= 499) {
        costoEnvio = 0; // ¡Descuento aplicado!
    }

    // 3. Calculamos el Gran Total
    const totalFinal = subtotal + costoEnvio;

    // 4. Actualizamos la pantalla (DOM)
    
    // A) Subtotal
    if(document.getElementById('rSubtotal')) {
        document.getElementById('rSubtotal').innerText = '$' + subtotal.toFixed(2);
    }

    // B) Envío (Con lógica visual verde si es gratis)
    const labelEnvio = document.getElementById('rEnvio');
    if(labelEnvio) {
        if (costoEnvio === 0) {
            labelEnvio.innerText = 'Gratis';
            labelEnvio.classList.add('text-success', 'fw-bold'); // Verde y negrita
        } else {
            labelEnvio.innerText = '$' + costoEnvio.toFixed(2);
            labelEnvio.classList.remove('text-success', 'fw-bold');
        }
    }

    // C) Total Final
    if(document.getElementById('rTotal')) {
        document.getElementById('rTotal').innerText = '$' + totalFinal.toFixed(2);
    }
}
// ==========================================
// C. ACCIONES (Eliminar / Vaciar)
// ==========================================

window.eliminarItem = async function(idDetalle) {
    if(!confirm("¿Seguro que deseas eliminar este producto?")) return;
    
    try {
        await fetch(`${API_URL}/carrito/detalle/${idDetalle}`, { method: 'DELETE' });
        cargarCarritoDelServidor(); // Recargar para ver cambios
    } catch (e) {
        console.error("Error al eliminar:", e);
        alert("No se pudo eliminar el producto.");
    }
};

window.vaciarCarrito = async function() {
    if(!confirm("¿Estás seguro de vaciar todo el carrito?")) return;

    const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));
    
    try {
        await fetch(`${API_URL}/carrito/vaciar/${usuarioLogueado.id}`, { method: 'DELETE' });
        cargarCarritoDelServidor(); // Recargar
    } catch (e) {
        console.error("Error al vaciar:", e);
        alert("Error al vaciar el carrito.");
    }
};

// ==========================================
// D. IR A PAGAR (Simulación)
// ==========================================
window.irAPagar = function() {
    if (!carritoActual.detalles || carritoActual.detalles.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }
    // Guardamos el ID del carrito para usarlo en el proceso de pedido
    localStorage.setItem('idCarritoActivo', carritoActual.idCarrito);
    
    alert("¡Listo! Redirigiendo al pago (Próximamente)...");
    // window.location.href = 'pago.html'; // Descomentar cuando tengas esa página
};


// ==========================================
// E. INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    cargarCarritoDelServidor(); // Cargar datos reales al abrir la página
    
    const btnVaciar = document.getElementById('btnVaciar');
    if(btnVaciar) btnVaciar.addEventListener('click', window.vaciarCarrito);
    
    const btnPagar = document.getElementById('btnPagar');
    if(btnPagar) btnPagar.addEventListener('click', window.irAPagar);
});
