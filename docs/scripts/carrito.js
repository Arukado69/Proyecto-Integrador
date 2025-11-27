// --- CONFIGURACIÓN BACKEND ---
const API_URL = 'http://localhost:8080/api'; 

// Variable Global para el "Puente"
let carritoDelServidor = []; 

// ==========================================
// A. CARGA DE DATOS (GET del Servidor)
// ==========================================

async function cargarCarritoDelServidor() {
    const contenedorItems = document.getElementById('listaItems');
    try {
        // 1. Pedir carrito a Java
        const response = await fetch(`${API_URL}/carrito`);
        
        if (response.ok) {
            carritoDelServidor = await response.json();
            
            // 2. Renderizar
            renderizarCarritoUI(carritoDelServidor);
            actualizarTotales(carritoDelServidor);
        } else {
            console.error("Error al cargar carrito");
            contenedorItems.innerHTML = '<p class="text-center">Error cargando tu carrito.</p>';
        }
    } catch (e) {
        console.error("Error de conexión:", e);
        contenedorItems.innerHTML = '<p class="text-center">No se pudo conectar con el servidor.</p>';
    }
}

// ==========================================
// B. RENDERIZADO (Visual)
// ==========================================

function renderizarCarritoUI(carrito) {
    const contenedorItems = document.getElementById('listaItems');
    const estadoVacio = document.getElementById('estadoVacio');
    const actionsBar = document.getElementById('actionsBar');

    if (carrito.length === 0) {
        if(estadoVacio) estadoVacio.classList.remove('d-none');
        if(contenedorItems) contenedorItems.innerHTML = '';
        if(actionsBar) actionsBar.classList.add('d-none');
        return;
    }

    if(estadoVacio) estadoVacio.classList.add('d-none');
    if(actionsBar) actionsBar.classList.remove('d-none');

    contenedorItems.innerHTML = '';
    
    carrito.forEach(item => {
        const totalItem = item.price * item.cantidad;
        let rutaImg = item.imageURL;
        if(rutaImg && rutaImg.startsWith('..')) rutaImg = rutaImg.replace('..', '');

        const htmlItem = `
            <div class="card shadow-sm border-light mb-2"> 
                <div class="card-body p-3">
                    <div class="row align-items-center g-3">
                        <div class="col-4 col-md-2 text-center">
                            <img src="${rutaImg}" alt="${item.name}" class="img-fluid rounded" 
                                 style="max-height: 80px;" onerror="this.src='https://via.placeholder.com/80'">
                        </div>
                        <div class="col-8 col-md-4">
                            <h6 class="fw-bold text-dark mb-1 text-truncate">${item.name}</h6>
                            <small class="text-muted">Unitalla</small>
                        </div>
                        <div class="col-6 col-md-3 d-flex justify-content-center">
                            <span class="fw-bold">Cant: ${item.cantidad}</span>
                        </div>
                        <div class="col-6 col-md-3 text-end">
                            <div class="fw-bold text-primary mb-1">$${totalItem.toFixed(2)}</div>
                            <button class="btn btn-link text-danger p-0 small" onclick="window.eliminarItem(${item.id})">
                                <i class="bi bi-trash3"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
        contenedorItems.innerHTML += htmlItem;
    });
}

function actualizarTotales(carrito) {
    // ... (Tu misma lógica de sumas de antes, sin cambios)
    let subtotal = carrito.reduce((acc, item) => acc + (item.price * item.cantidad), 0);
    // ... (calculo de iva, envio, etc)
    const elTotal = document.getElementById('rTotal');
    if(elTotal) elTotal.innerText = '$' + subtotal.toFixed(2); // Simplificado
}

// ==========================================
// C. EL PUENTE (Ir a Pagar - Simulación)
// ==========================================

window.irAPagar = function() {
    if (carritoDelServidor.length === 0) {
        alert("Carrito vacío");
        return;
    }

    // 1. TOMAR LA FOTO (Snapshot) del servidor
    localStorage.setItem('carritoWoofBarf', JSON.stringify(carritoDelServidor));
    
    // 2. Guardar totales visuales
    const totalTexto = document.getElementById('rTotal').innerText;
    localStorage.setItem('resumenPedido', JSON.stringify({ totalString: totalTexto }));

    // 3. Redirigir a la simulación (Datos -> Pago)
    window.location.href = '/pages/carrito/datos.html';
};

// ==========================================
// D. ACCIONES (Eliminar / Vaciar - Llamadas a API)
// ==========================================

window.eliminarItem = async function(id) {
    if(!confirm("¿Eliminar?")) return;
    
    await fetch(`${API_URL}/carrito/${id}`, { method: 'DELETE' });
    cargarCarritoDelServidor(); // Recargar datos
    if (window.actualizarBadgeNavbar) window.actualizarBadgeNavbar();
};

window.vaciarCarrito = async function() {
    if(!confirm("¿Vaciar todo?")) return;

    await fetch(`${API_URL}/carrito`, { method: 'DELETE' });
    cargarCarritoDelServidor(); // Recargar
    if (window.actualizarBadgeNavbar) window.actualizarBadgeNavbar();
};

// ==========================================
// E. INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    cargarCarritoDelServidor(); // Cargar datos reales
    
    // Listeners botones estáticos
    const btnPagar = document.getElementById('btnPagar');
    if(btnPagar) btnPagar.addEventListener('click', window.irAPagar);
    
    const btnVaciar = document.getElementById('btnVaciar');
    if(btnVaciar) btnVaciar.addEventListener('click', window.vaciarCarrito);

    if (typeof window.actualizarBadgeNavbar === 'function') {
        window.actualizarBadgeNavbar();
    }
});