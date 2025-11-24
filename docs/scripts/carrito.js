// 1. IMPORTS
import { listaDeProductos } from '/scripts/productos.js'; 

// ==========================================
// A. CONFIGURACIÓN Y MODELO (Estado)
// ==========================================
const CLAVE_CARRITO = 'carritoWoofBarf';

// Variables de Estado Temporal (Para la sesión actual)
let descuentoAplicado = 0;   // Porcentaje (ej: 0.10)
let costoEnvioManual = null; // Si el usuario calcula envío y no aplica gratis

// Obtener carrito almacenado o devolver array vacío
function obtenerCarrito() {
    const almacenado = localStorage.getItem(CLAVE_CARRITO);
    return almacenado ? JSON.parse(almacenado) : [];
}

// Guardar el array actualizado
function guardarCarrito(carrito) {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

// ==========================================
// B. CONTROLADOR (Lógica del Negocio)
// ==========================================

// --- ACCIONES DE PRODUCTOS ---

window.agregarAlCarrito = function(idProducto) {
    let carrito = obtenerCarrito();
    const itemExistente = carrito.find(item => item.id === idProducto);

    if (itemExistente) {
        itemExistente.cantidad++;
        alert("¡Cantidad actualizada (+1) en el carrito!"); 
    } else {
        const productoInfo = listaDeProductos.find(p => p.id === idProducto);
        if (productoInfo) {
            carrito.push({ ...productoInfo, cantidad: 1 });
            alert("¡Producto agregado al carrito!");
        } else {
            console.error("Error: Producto no encontrado con ID", idProducto);
            return;
        }
    }
    guardarCarrito(carrito);
    renderizarCarritoUI();
};

window.cambiarCantidad = function(id, cambio) {
    let carrito = obtenerCarrito();
    const item = carrito.find(p => p.id === id);

    if (item) {
        item.cantidad += cambio;
        if (item.cantidad < 1) item.cantidad = 1;
        guardarCarrito(carrito);
        renderizarCarritoUI();
    }
};

window.eliminarItem = function(id) {
    if(confirm("¿Seguro que quieres eliminar este producto?")) {
        let carrito = obtenerCarrito();
        carrito = carrito.filter(p => p.id !== id);
        guardarCarrito(carrito);
        renderizarCarritoUI();
    }
};

window.vaciarCarrito = function() {
    if(confirm("¿Vaciar todo el carrito?")) {
        localStorage.removeItem(CLAVE_CARRITO);
        renderizarCarritoUI();
    }
};

// --- ACCIONES DEL SIDEBAR (CUPONES Y ENVÍO) ---

window.aplicarCupon = function() {
    const inputCupon = document.getElementById('cupon');
    const feedback = document.getElementById('cuponFeedback');
    const codigo = inputCupon.value.trim().toUpperCase();

    // Simulación de cupones válidos
    const cuponesValidos = {
        'WOOF10': 0.10, // 10%
        'BARF20': 0.20, // 20%
        'JO': 0.50      // 50% (Tu cupón secreto)
    };

    if (cuponesValidos[codigo]) {
        descuentoAplicado = cuponesValidos[codigo];
        feedback.innerHTML = `<span class="text-success small"><i class="bi bi-check-circle"></i> Cupón aplicado: -${descuentoAplicado * 100}%</span>`;
        inputCupon.classList.add('is-valid');
        inputCupon.classList.remove('is-invalid');
        inputCupon.disabled = true; 
        document.getElementById('btnAplicarCupon').disabled = true;
    } else {
        descuentoAplicado = 0;
        feedback.innerHTML = `<span class="text-danger small"><i class="bi bi-x-circle"></i> Cupón no válido</span>`;
        inputCupon.classList.add('is-invalid');
    }
    renderizarCarritoUI(); // Recalcular precios
};

window.calcularEnvioCP = function() {
    const cpInput = document.getElementById('cp');
    const resultado = document.getElementById('cpResultado');
    const cp = cpInput.value.trim();

    if (cp.length === 5 && !isNaN(cp)) {
        if (cp.startsWith('0') || cp.startsWith('1')) { // Simulación CDMX
            costoEnvioManual = 100;
            resultado.innerHTML = '<span class="text-success small">Envío local: $100.00</span>';
        } else {
            costoEnvioManual = 180;
            resultado.innerHTML = '<span class="text-info small">Envío nacional: $180.00</span>';
        }
    } else {
        resultado.innerHTML = '<span class="text-danger small">Ingresa un CP válido de 5 dígitos</span>';
        costoEnvioManual = null;
    }
    renderizarCarritoUI(); // Recalcular precios
};

window.irAPagar = function() {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    // Guardar resumen para la página "Datos"
    const totalString = document.getElementById('rTotal').innerText;
    localStorage.setItem('resumenPedido', JSON.stringify({
        totalString: totalString,
        itemsCount: carrito.length
    }));

    // Redireccionar
    window.location.href = './datos.html';
};

// ==========================================
// C. VISTA (Renderizado del Carrito Principal)
// ==========================================

function renderizarCarritoUI() {
    const carrito = obtenerCarrito();
    
    // Referencias al DOM
    const contenedorItems = document.getElementById('listaItems');
    const estadoVacio = document.getElementById('estadoVacio');
    const hintMostrando = document.getElementById('hintMostrando');
    const actionsBar = document.getElementById('actionsBar');

    // 1. Estado Vacío
    if (carrito.length === 0) {
        estadoVacio.classList.remove('d-none');
        contenedorItems.innerHTML = '';
        actionsBar.classList.add('d-none');
        hintMostrando.innerText = 'Mostrando 0 artículos';
        actualizarTotales(0);
        return;
    }

    // 2. Estado Con Productos
    estadoVacio.classList.add('d-none');
    actionsBar.classList.remove('d-none');
    hintMostrando.innerText = `Mostrando ${carrito.length} artículos`;

    contenedorItems.innerHTML = '';
    
    carrito.forEach(item => {
        const totalItem = item.price * item.cantidad;
        
        const htmlItem = `
            <div class="card shadow-sm border-light mb-2"> 
                <div class="card-body p-3">
                    <div class="row align-items-center g-3">
                        <div class="col-4 col-md-2 text-center">
                            <img src="${item.imageURL}" alt="${item.name}" class="img-fluid rounded" style="max-height: 80px;">
                        </div>
                        
                        <div class="col-8 col-md-4">
                            <h6 class="fw-bold text-dark mb-1 text-truncate">${item.name}</h6>
                            <small class="text-muted">${item.category} | ${item.size || 'Unitalla'}</small>
                        </div>

                        <div class="col-6 col-md-3 d-flex justify-content-center">
                            <div class="input-group input-group-sm" style="width: 100px;">
                                <button class="btn btn-outline-secondary" onclick="window.cambiarCantidad(${item.id}, -1)">-</button>
                                <span class="form-control text-center bg-white">${item.cantidad}</span>
                                <button class="btn btn-outline-secondary" onclick="window.cambiarCantidad(${item.id}, 1)">+</button>
                            </div>
                        </div>

                        <div class="col-6 col-md-3 text-end">
                            <div class="fw-bold text-primary mb-1">$${totalItem.toFixed(2)}</div>
                            <button class="btn btn-link text-danger p-0 small text-decoration-none" onclick="window.eliminarItem(${item.id})">
                                <i class="bi bi-trash3"></i> Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        contenedorItems.innerHTML += htmlItem;
    });

    actualizarTotales(carrito);
}

// Función MATEMÁTICA Mejorada (Incluye lógica Sidebar)
function actualizarTotales(carrito) {
    if (carrito === 0 || carrito.length === 0) {
        document.getElementById('rSubtotal').innerText = '$0.00';
        document.getElementById('rEnvio').innerText = '$0.00';
        document.getElementById('rIva').innerText = '$0.00';
        document.getElementById('rTotal').innerText = '$0.00';
        if(document.getElementById('rDescuento')) document.getElementById('rDescuento').innerText = '-$0.00';
        return;
    }

    // 1. Subtotal Base
    let subtotal = carrito.reduce((acc, item) => acc + (item.price * item.cantidad), 0);
    
    // 2. Descuento
    const montoDescuento = subtotal * descuentoAplicado;
    const subtotalConDescuento = subtotal - montoDescuento;

    // 3. Envío (Regla: Gratis si > 499, si no usa el manual calculado, si no default 150)
    let envioFinal = 0;
    if (subtotalConDescuento >= 499) {
        envioFinal = 0;
    } else if (costoEnvioManual !== null) {
        envioFinal = costoEnvioManual;
    } else {
        envioFinal = 150;
    }

    // 4. IVA (Sobre el subtotal ya descontado) y Total
    const iva = subtotalConDescuento * 0.16; 
    const totalAPagar = subtotalConDescuento + iva + envioFinal;

    // 5. Renderizado
    const formato = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

    document.getElementById('rSubtotal').innerText = formato.format(subtotal);
    
    // Pintar descuento si existe la etiqueta en HTML
    const elDescuento = document.getElementById('rDescuento');
    if (elDescuento) {
        elDescuento.innerText = `-${formato.format(montoDescuento)}`;
        elDescuento.classList.toggle('text-success', montoDescuento > 0);
    }

    document.getElementById('rIva').innerText = formato.format(iva);
    
    const elEnvio = document.getElementById('rEnvio');
    if (envioFinal === 0) {
        elEnvio.innerHTML = '<span class="text-success fw-bold">Gratis</span>';
    } else {
        elEnvio.innerText = formato.format(envioFinal);
    }

    document.getElementById('rTotal').innerText = formato.format(totalAPagar);
}

// ==========================================
// D. LÓGICA DEL CARRUSEL
// ==========================================

const contenedorCarrusel = document.getElementById('recoSlides');
let ultimoAncho = window.innerWidth; 

function renderizarCarrusel(productos) {
    if(!contenedorCarrusel) return; 

    contenedorCarrusel.innerHTML = '';
    const esMovil = window.innerWidth < 992;
    const itemsPorSlide = esMovil ? 1 : 3;
    const claseColumna = esMovil ? 'col-12' : 'col-4';

    for (let i = 0; i < productos.length; i += itemsPorSlide) {
        const grupo = productos.slice(i, i + itemsPorSlide);
        const claseActiva = i === 0 ? 'active' : '';

        let slideHTML = `
            <div class="carousel-item ${claseActiva}">
                <div class="row justify-content-center g-3"> 
        `;

        grupo.forEach(prod => {
            slideHTML += `
                <div class="${claseColumna}">
                    <div class="card h-100 shadow-sm border-0">
                        <div class="d-flex align-items-center justify-content-center bg-light rounded-top" style="height: 180px; overflow: hidden;">
                            <img src="${prod.imageURL}" alt="${prod.name}" class="img-fluid" style="max-height: 100%; width: auto;">
                        </div>
                        <div class="card-body text-center d-flex flex-column p-3">
                            <h6 class="card-title fw-bold text-dark">${prod.name}</h6>
                            <p class="card-text text-primary fw-bold mb-3">$${prod.price} MXN</p>
                            <button class="btn btn-outline-dark w-100 mt-auto rounded-pill" onclick="window.agregarAlCarrito(${prod.id})">
                                Agregar
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        slideHTML += `</div></div>`;
        contenedorCarrusel.innerHTML += slideHTML;
    }
}

// ==========================================
// E. INICIALIZACIÓN ÚNICA
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar items del carrito guardados
    renderizarCarritoUI();

    // 2. Cargar carrusel 
    renderizarCarrusel(listaDeProductos.slice(0, 6));

    // 3. LISTENERS DEL DOM (Para botones que no se generan dinámicamente)
    
    // Botón Vaciar
    const btnVaciar = document.getElementById('btnVaciar');
    if(btnVaciar) btnVaciar.addEventListener('click', window.vaciarCarrito);

    // Botones Sidebar (Cupones, Envío, Pagar)
    const btnCupon = document.getElementById('btnAplicarCupon');
    if(btnCupon) btnCupon.addEventListener('click', window.aplicarCupon);

    const btnCP = document.getElementById('btnCalcularCP');
    if(btnCP) btnCP.addEventListener('click', window.calcularEnvioCP);

    const btnPagar = document.getElementById('btnPagar');
    if(btnPagar) btnPagar.addEventListener('click', window.irAPagar);
});

// Listener Resize
window.addEventListener('resize', () => {
    const anchoActual = window.innerWidth;
    const eraMovil = ultimoAncho < 992;
    const esMovilAhora = anchoActual < 992;
    if (eraMovil !== esMovilAhora) {
        renderizarCarrusel(listaDeProductos.slice(0, 6));
    }
    ultimoAncho = anchoActual;
});