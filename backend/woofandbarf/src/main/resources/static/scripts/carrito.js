// --- CONFIGURACIÓN BACKEND ---
const API_URL = 'http://52.15.203.222:8080/api/v1';

// --- VARIABLES GLOBALES ---
let carritoActual = { detalles: [], total: 0 }; 
let inventarioCompleto = []; 

let descuentoAplicado = 0;   
let costoEnvioManual = null; 

// ==========================================
// A. UTILIDADES (MODAL)
// ==========================================
let modalInstancia = null; 

function mostrarModalBootstrap({ title, text, imageUrl, confirmText, cancelText, onConfirm }) {
    const modalEl = document.getElementById('modalWoof');
    if(!modalEl) return; 

    document.getElementById('modalTitulo').innerText = title || 'Aviso';
    document.getElementById('modalMensaje').innerText = text || '';

    const imgEl = document.getElementById('modalImagen');
    if (imageUrl) {
        let cleanUrl = imageUrl;
        if(cleanUrl.startsWith('..')) cleanUrl = cleanUrl.replace('..', '');
        imgEl.src = cleanUrl;
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

    btnConfirmar.onclick = null; 
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
// B. CARGA DE DATOS
// ==========================================

async function cargarCarritoDelServidor() {
    const contenedorItems = document.getElementById('listaItems');
    const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));

    if (!usuarioLogueado) return;

    try {
        const response = await fetch(`${API_URL}/carrito/usuario/${usuarioLogueado.id}`);
        
        if (response.ok) {
            carritoActual = await response.json();
            renderizarCarritoUI(carritoActual.detalles || []);
            actualizarTotales(carritoActual);
            
            if(window.actualizarBadgeNavbar) window.actualizarBadgeNavbar();
        } else {
            console.error("Error al cargar carrito");
            contenedorItems.innerHTML = '<p class="text-center">Error al cargar.</p>';
        }
    } catch (e) {
        console.error(e);
        contenedorItems.innerHTML = '<p class="text-center">Error de conexión.</p>';
    }
}

async function cargarInventarioCarrusel() {
    try {
        const response = await fetch(`${API_URL}/productos`);
        if (response.ok) {
            inventarioCompleto = await response.json();
            renderizarCarrusel(inventarioCompleto);
        }
    } catch (e) { console.error(e); }
}

// ==========================================
// C. RENDERIZADO (Con tus correcciones)
// ==========================================

function renderizarCarritoUI(detalles) {
    const contenedorItems = document.getElementById('listaItems');
    const estadoVacio = document.getElementById('estadoVacio');
    const actionsBar = document.getElementById('actionsBar');
    const hintMostrando = document.getElementById('hintMostrando'); // Referencia al texto

    // 1. ESTADO VACÍO
    if (!detalles || detalles.length === 0) {
        if(estadoVacio) estadoVacio.classList.remove('d-none');
        if(contenedorItems) contenedorItems.innerHTML = '';
        if(actionsBar) actionsBar.classList.add('d-none');
        if(hintMostrando) hintMostrando.innerText = 'Mostrando 0 artículos'; // Actualizar texto
        actualizarTotales({ total: 0 }); 
        return;
    }

    // 2. ESTADO CON PRODUCTOS
    if(estadoVacio) estadoVacio.classList.add('d-none');
    if(actionsBar) actionsBar.classList.remove('d-none');

    // --- CORRECCIÓN 1: ACTUALIZAR EL TEXTO DEL HEADER ---
    // Sumamos las cantidades de todos los items
    const totalUnidades = detalles.reduce((acc, item) => acc + item.cantidad, 0);
    if(hintMostrando) {
        hintMostrando.innerText = `Mostrando ${totalUnidades} artículos`;
    }

    contenedorItems.innerHTML = '';
    
    // 3. GENERAR CARDS
    detalles.forEach(detalle => {
        const producto = detalle.producto; 
        const totalItem = detalle.subtotal; 
        
        let rutaImg = producto.imagenUrl;
        if(rutaImg && rutaImg.startsWith('..')) {
            rutaImg = rutaImg.replace('..', '');
        } else if (!rutaImg) {
            rutaImg = '../assets/imagenes/iconos/logo-default.png';
        }

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
                            <div class="input-group input-group-sm" style="width: 110px;">
                                <button class="btn btn-outline-secondary" 
                                        onclick="window.restarUnidad(${producto.idProducto}, ${detalle.cantidad}, ${detalle.idCarritoDetalle})">
                                    <i class="bi bi-dash"></i>
                                </button>
                                
                                <span class="form-control text-center bg-white px-0 fw-bold">
                                    ${detalle.cantidad}
                                </span>
                                
                                <button class="btn btn-outline-secondary" 
                                        onclick="window.agregarAlCarrito(${producto.idProducto})">
                                    <i class="bi bi-plus"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="col-6 col-md-3 text-end">
                            <div class="fw-bold text-primary mb-1">$${totalItem.toFixed(2)}</div>
                            <button class="btn btn-link text-danger p-0 small text-decoration-none" 
                                    onclick="window.eliminarItem(${detalle.idCarritoDetalle})">
                                <i class="bi bi-trash3"></i> Eliminar
                            </button>
                        </div>

                    </div>
                </div>
            </div>`;
        contenedorItems.innerHTML += htmlItem;
    });
}

function actualizarTotales(carritoData) {
    const elSub = document.getElementById('rSubtotal');
    const elTot = document.getElementById('rTotal');
    const elDes = document.getElementById('rDescuento');
    const elEnv = document.getElementById('rEnvio');
    const elIva = document.getElementById('rIva');

    if (!elSub || !elTot) return;

    let subtotal = 0;
    if (carritoData.detalles) {
        subtotal = carritoData.detalles.reduce((acc, d) => acc + (d.producto.precio * d.cantidad), 0);
    }

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
    const granTotal = subtotalConDescuento + iva + envioFinal;

    const formato = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

    elSub.innerText = formato.format(subtotal);
    if(elIva) elIva.innerText = formato.format(iva);
    
    if (elDes) {
        elDes.innerText = `-${formato.format(montoDescuento)}`;
        montoDescuento > 0 ? elDes.classList.add('text-success') : elDes.classList.remove('text-success');
    }

    if (elEnv) {
        if (envioFinal === 0) {
            elEnv.innerHTML = '<span class="text-success fw-bold">Gratis</span>';
        } else {
            elEnv.innerText = formato.format(envioFinal);
        }
    }

    elTot.innerText = formato.format(granTotal);
}

// ==========================================
// D. LÓGICA DEL CARRUSEL
// ==========================================
const contenedorCarrusel = document.getElementById('recoSlides');

function renderizarCarrusel(productos) {
    if(!contenedorCarrusel) return; 
    if (!productos || productos.length === 0) return;

    const listaCarrusel = productos.slice(0, 6); 
    contenedorCarrusel.innerHTML = '';
    
    const esMovil = window.innerWidth < 992;
    const itemsPorSlide = esMovil ? 1 : 3;
    const claseColumna = esMovil ? 'col-12' : 'col-4';

    for (let i = 0; i < listaCarrusel.length; i += itemsPorSlide) {
        const grupo = listaCarrusel.slice(i, i + itemsPorSlide);
        const claseActiva = i === 0 ? 'active' : '';

        let slideHTML = `<div class="carousel-item ${claseActiva}"><div class="row justify-content-center g-3">`;

        grupo.forEach(prod => {
            let rutaImg = prod.imagenUrl;
            if(rutaImg && rutaImg.startsWith('..')) rutaImg = rutaImg.replace('..', '');
            else if(!rutaImg) rutaImg = '../assets/imagenes/iconos/logo-default.png';

            slideHTML += `
                <div class="${claseColumna}">
                    <div class="card h-100 card-carrusel border-0 shadow-sm">
                        <div style="height: 200px; overflow: hidden;" class="rounded-top d-flex align-items-center justify-content-center">
                             <img src="${rutaImg}" alt="${prod.nombre}" class="img-fluid" style="max-height: 100%;"
                                  onerror="this.src='../assets/imagenes/iconos/logo-default.png'">
                        </div>
                        <div class="card-body text-center d-flex flex-column p-3">
                            <h6 class="card-title fw-bold text-dark text-truncate">${prod.nombre}</h6>
                            <p class="card-text text-primary fw-bold mb-3">$${prod.precio.toFixed(2)}</p>
                            <button class="btn btn-outline-warning w-100 mt-auto rounded-pill fw-bold" 
                                    onclick="window.agregarDesdeCarrusel(${prod.idProducto})">
                                Agregar
                            </button>
                        </div>
                    </div>
                </div>`;
        });
        slideHTML += `</div></div>`;
        contenedorCarrusel.innerHTML += slideHTML;
    }
}

window.agregarDesdeCarrusel = async function(idProducto) {
    // Reutilizamos la lógica principal de agregar
    window.agregarAlCarrito(idProducto);
};

// ==========================================
// E. ACCIONES (Agregar, Restar, Eliminar)
// ==========================================

window.agregarAlCarrito = async function(idProducto) {
    const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));
    if (!usuarioLogueado) return;

    try {
        await fetch(`${API_URL}/carrito/agregar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                idUsuario: usuarioLogueado.id, 
                idProducto: idProducto, 
                cantidad: 1 
            })
        });
        // Recargamos sin mostrar modal intrusivo (solo refresco)
        cargarCarritoDelServidor();
    } catch(e) { console.error(e); }
};

// --- NUEVA FUNCIÓN: RESTAR UNIDAD ---
window.restarUnidad = async function(idProducto, cantidadActual, idDetalle) {
    // 1. Si solo queda 1, preguntamos si quiere eliminar la fila
    if (cantidadActual <= 1) {
        window.eliminarItem(idDetalle);
        return;
    }

    const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));
    
    try {
        // 2. Si hay más de 1, enviamos -1 al endpoint de agregar (Truco común)
        await fetch(`${API_URL}/carrito/agregar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                idUsuario: usuarioLogueado.id, 
                idProducto: idProducto, 
                cantidad: -1 // RESTAMOS 1
            })
        });
        cargarCarritoDelServidor();
    } catch(e) { 
        console.error("Error al restar:", e); 
    }
};

window.eliminarItem = function(idDetalle) {
    mostrarModalBootstrap({
        title: '¿Eliminar producto?',
        text: 'Se quitará este producto de tu carrito.',
        confirmText: 'Sí, eliminar',
        cancelText: 'Cancelar',
        onConfirm: async () => {
            try {
                await fetch(`${API_URL}/carrito/detalle/${idDetalle}`, { method: 'DELETE' });
                cargarCarritoDelServidor(); 
                if (window.actualizarBadgeNavbar) window.actualizarBadgeNavbar();
            } catch (e) { console.error(e); }
        }
    });
};

window.vaciarCarrito = function() {
    mostrarModalBootstrap({
        title: '¿Vaciar carrito?',
        text: 'Se borrará todo.',
        confirmText: 'Sí, vaciar',
        cancelText: 'Cancelar',
        onConfirm: async () => {
            const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));
            try {
                await fetch(`${API_URL}/carrito/vaciar/${usuarioLogueado.id}`, { method: 'DELETE' });
                cargarCarritoDelServidor(); 
                if (window.actualizarBadgeNavbar) window.actualizarBadgeNavbar();
            } catch (e) { console.error(e); }
        }
    });
};

// --- PUENTE DE PAGO ---
window.irAPagar = function() {
    if (!carritoActual.detalles || carritoActual.detalles.length === 0) {
        mostrarModalBootstrap({ title: 'Carrito vacío', text: 'No hay productos.', confirmText: 'Ok' });
        return;
    }

    const snapshot = carritoActual.detalles.map(d => ({
        id: d.producto.idProducto,
        name: d.producto.nombre,
        price: d.producto.precio,
        cantidad: d.cantidad,
        imageURL: d.producto.imagenUrl || ''
    }));

    localStorage.setItem('carritoWoofBarf', JSON.stringify(snapshot));
    const totalTexto = document.getElementById('rTotal').innerText;
    localStorage.setItem('resumenPedido', JSON.stringify({ totalString: totalTexto }));

    window.location.href = '/pages/carrito/datos.html'; 
};

// --- SIDEBAR ---
window.aplicarCupon = function() {
    const input = document.getElementById('cupon');
    if(!input) return;
    const codigo = input.value.trim().toUpperCase();
    const cupones = { 'WOOF10': 0.10, 'BARF20': 0.20, 'JO': 0.50 };

    if (cupones[codigo]) {
        descuentoAplicado = cupones[codigo];
        document.getElementById('cuponFeedback').innerHTML = `<span class="text-success small fw-bold">¡Descuento aplicado!</span>`;
        input.classList.add('is-valid');
    } else {
        descuentoAplicado = 0;
        document.getElementById('cuponFeedback').innerHTML = `<span class="text-danger small">No válido.</span>`;
        input.classList.add('is-invalid');
    }
    actualizarTotales(carritoActual);
};

window.calcularEnvioCP = function() {
    const cpInput = document.getElementById('cp');
    const res = document.getElementById('cpResultado');
    if(!cpInput) return;
    const cp = cpInput.value.trim();

    if (cp.length === 5 && !isNaN(cp)) {
        if (cp.startsWith('0') || cp.startsWith('1')) { 
            costoEnvioManual = 100;
            res.innerHTML = '<span class="text-success small">Envío Local: $100</span>';
        } else {
            costoEnvioManual = 180;
            res.innerHTML = '<span class="text-info small">Envío Nacional: $180</span>';
        }
    } else {
        res.innerHTML = '<span class="text-danger small">CP inválido</span>';
        costoEnvioManual = null;
    }
    actualizarTotales(carritoActual);
};

// ==========================================
// G. INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    cargarCarritoDelServidor(); 
    cargarInventarioCarrusel(); 
    
    const btnVaciar = document.getElementById('btnVaciar');
    if(btnVaciar) btnVaciar.addEventListener('click', window.vaciarCarrito);
    
    const btnPagar = document.getElementById('btnPagar');
    if(btnPagar) btnPagar.addEventListener('click', window.irAPagar);

    const btnCupon = document.getElementById('btnAplicarCupon');
    if(btnCupon) btnCupon.addEventListener('click', window.aplicarCupon);

    const btnCP = document.getElementById('btnCalcularCP');
    if(btnCP) btnCP.addEventListener('click', window.calcularEnvioCP);
});

window.addEventListener('resize', () => {
    if(inventarioCompleto.length > 0) renderizarCarrusel(inventarioCompleto);
});