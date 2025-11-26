// 1. IMPORTS
import { listaDeProductos } from '/scripts/productos.js'; 

// ==========================================
// A. CONFIGURACIÓN Y MODELO (Estado)
// ==========================================
const CLAVE_CARRITO = 'carritoWoofBarf';

// Variables de Estado Temporal
let descuentoAplicado = 0;   
let costoEnvioManual = null; 

// Obtener carrito almacenado o devolver array vacío
function obtenerCarrito() {
    const almacenado = localStorage.getItem(CLAVE_CARRITO);
    return almacenado ? JSON.parse(almacenado) : [];
}

// Guardar el array actualizado
function guardarCarrito(carrito) {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));

    // Actualizar badge al guardar (agregar/editar)
    if (typeof window.actualizarBadgeNavbar === 'function') {
        window.actualizarBadgeNavbar();
    }
}

// ==========================================
// B. UTILIDAD: MODAL BOOTSTRAP
// ==========================================
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

// ==========================================
// C. CONTROLADOR (Lógica del Negocio)
// ==========================================

window.agregarAlCarrito = function(idProducto) {
    let carrito = obtenerCarrito();
    const itemExistente = carrito.find(item => item.id === idProducto);

    if (itemExistente) {
        itemExistente.cantidad++;
        
        mostrarModalBootstrap({
            title: '¡Cantidad Actualizada!',
            text: 'Agregamos una unidad más a tu carrito.',
            confirmText: 'Entendido'
        });

    } else {
        const productoInfo = listaDeProductos.find(p => p.id === idProducto);
        if (productoInfo) {
            carrito.push({ ...productoInfo, cantidad: 1 });
            
            const rutaImg = productoInfo.imageURL.replace('..', ''); 

            mostrarModalBootstrap({
                title: '¡Producto Agregado!',
                text: `¿Qué te gustaría hacer ahora?`,
                imageUrl: rutaImg,
                confirmText: 'Seguir comprando', 
                cancelText: 'Ir a pagar'         
            });

            document.getElementById('btnCancelar').onclick = function() {
                window.location.href = '/pages/carrito/datos.html';
            };

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
    mostrarModalBootstrap({
        title: '¿Eliminar producto?',
        text: 'Esta acción sacará el producto de tu lista.',
        confirmText: 'Sí, eliminar',
        cancelText: 'Cancelar',
        onConfirm: () => {
            let carrito = obtenerCarrito();
            carrito = carrito.filter(p => p.id !== id);
            guardarCarrito(carrito);
            renderizarCarritoUI();
        }
    });
};

// --- AQUÍ ESTÁ LA FUNCIÓN CORREGIDA ---
window.vaciarCarrito = function() {
    mostrarModalBootstrap({
        title: '¿Vaciar carrito?',
        text: 'Se borrarán todos los productos seleccionados.',
        confirmText: 'Sí, vaciar todo',
        cancelText: 'Cancelar',
        onConfirm: () => {
            localStorage.removeItem(CLAVE_CARRITO);
            renderizarCarritoUI();
            
            // Actualizar Badge manualmente al vaciar
            if (typeof window.actualizarBadgeNavbar === 'function') {
                window.actualizarBadgeNavbar();
            }
        }
    });
};

// --- ACCIONES DEL SIDEBAR ---

window.aplicarCupon = function() {
    const inputCupon = document.getElementById('cupon');
    const feedback = document.getElementById('cuponFeedback');
    const codigo = inputCupon.value.trim().toUpperCase();

    const cuponesValidos = {
        'WOOF10': 0.10, 
        'BARF20': 0.20, 
        'JO': 0.50      
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
    renderizarCarritoUI(); 
};

window.calcularEnvioCP = function() {
    const cpInput = document.getElementById('cp');
    const resultado = document.getElementById('cpResultado');
    const cp = cpInput.value.trim();

    if (cp.length === 5 && !isNaN(cp)) {
        if (cp.startsWith('0') || cp.startsWith('1')) { 
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
    renderizarCarritoUI(); 
};

window.irAPagar = function() {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
        mostrarModalBootstrap({
            title: 'Carrito Vacío',
            text: 'Agrega productos antes de proceder al pago.',
            confirmText: 'Ok'
        });
        return;
    }

    const totalString = document.getElementById('rTotal').innerText;
    localStorage.setItem('resumenPedido', JSON.stringify({
        totalString: totalString,
        itemsCount: carrito.length
    }));

    window.location.href = '/pages/carrito/datos.html';
};

// ==========================================
// D. VISTA
// ==========================================

function renderizarCarritoUI() {
    const carrito = obtenerCarrito();
    
    const contenedorItems = document.getElementById('listaItems');
    const estadoVacio = document.getElementById('estadoVacio');
    const hintMostrando = document.getElementById('hintMostrando');
    const actionsBar = document.getElementById('actionsBar');

    if (carrito.length === 0) {
        estadoVacio.classList.remove('d-none');
        contenedorItems.innerHTML = '';
        actionsBar.classList.add('d-none');
        hintMostrando.innerText = 'Mostrando 0 artículos';
        actualizarTotales(0);
        return;
    }

    estadoVacio.classList.add('d-none');
    actionsBar.classList.remove('d-none');
    hintMostrando.innerText = `Mostrando ${carrito.length} artículos`;

    contenedorItems.innerHTML = '';
    
    carrito.forEach(item => {
        const totalItem = item.price * item.cantidad;
        const rutaImg = item.imageURL.replace('..', '');

        const htmlItem = `
            <div class="card shadow-sm border-light mb-2"> 
                <div class="card-body p-3">
                    <div class="row align-items-center g-3">
                        <div class="col-4 col-md-2 text-center">
                            <img src="${rutaImg}" alt="${item.name}" class="img-fluid rounded" style="max-height: 80px;">
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

function actualizarTotales(carrito) {
    if (carrito === 0 || carrito.length === 0) {
        document.getElementById('rSubtotal').innerText = '$0.00';
        document.getElementById('rEnvio').innerText = '$0.00';
        document.getElementById('rIva').innerText = '$0.00';
        document.getElementById('rTotal').innerText = '$0.00';
        if(document.getElementById('rDescuento')) document.getElementById('rDescuento').innerText = '-$0.00';
        return;
    }

    let subtotal = carrito.reduce((acc, item) => acc + (item.price * item.cantidad), 0);
    
    const montoDescuento = subtotal * descuentoAplicado;
    const subtotalConDescuento = subtotal - montoDescuento;

    let envioFinal = 0;
    if (subtotalConDescuento >= 499) {
        envioFinal = 0;
    } else if (costoEnvioManual !== null) {
        envioFinal = costoEnvioManual;
    } else {
        envioFinal = 150;
    }

    const iva = subtotalConDescuento * 0.16; 
    const totalAPagar = subtotalConDescuento + iva + envioFinal;

    const formato = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

    document.getElementById('rSubtotal').innerText = formato.format(subtotal);
    
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
// E. LÓGICA DEL CARRUSEL
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
            const rutaImg = prod.imageURL.replace('..', ''); 

            slideHTML += `
                <div class="${claseColumna}">
                    <div class="card h-100 card-carrusel">
                        <img src="${rutaImg}" 
                             alt="${prod.name}" 
                             onerror="this.src='https://via.placeholder.com/200?text=Sin+Imagen'">
                        
                        <div class="card-body text-center d-flex flex-column p-3">
                            <h6 class="card-title titulo-producto mb-2 text-truncate">
                                ${prod.name}
                            </h6>
                            <p class="card-text precio-producto mb-3">
                                $${prod.price} MXN
                            </p>
                            <button class="btn btn-carrusel w-100 mt-auto" onclick="window.agregarAlCarrito(${prod.id})">
                                <i class="bi bi-cart-plus"></i> Agregar
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
// F. INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    renderizarCarritoUI();
    renderizarCarrusel(listaDeProductos.slice(0, 6));

    // Actualizar badge al cargar
    if (typeof window.actualizarBadgeNavbar === 'function') {
        window.actualizarBadgeNavbar();
    }

    const btnVaciar = document.getElementById('btnVaciar');
    if(btnVaciar) btnVaciar.addEventListener('click', window.vaciarCarrito);

    const btnCupon = document.getElementById('btnAplicarCupon');
    if(btnCupon) btnCupon.addEventListener('click', window.aplicarCupon);

    const btnCP = document.getElementById('btnCalcularCP');
    if(btnCP) btnCP.addEventListener('click', window.calcularEnvioCP);

    const btnPagar = document.getElementById('btnPagar');
    if(btnPagar) btnPagar.addEventListener('click', window.irAPagar);
});

window.addEventListener('resize', () => {
    const anchoActual = window.innerWidth;
    const eraMovil = ultimoAncho < 992;
    const esMovilAhora = anchoActual < 992;
    if (eraMovil !== esMovilAhora) {
        renderizarCarrusel(listaDeProductos.slice(0, 6));
    }
    ultimoAncho = anchoActual;
});