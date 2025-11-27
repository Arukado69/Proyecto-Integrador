// --- CONFIGURACIÓN BACKEND ---
const API_URL = 'http://localhost:8080/api/v1'; 

// --- VARIABLES GLOBALES ---
let carritoActual = { detalles: [], total: 0 }; 
let inventarioCompleto = []; 

// Variables para la lógica visual del Sidebar (Resumen)
let descuentoAplicado = 0;   // 0.10 = 10%
let costoEnvioManual = null; // null = usa tarifa automática

// ==========================================
// A. UTILIDAD: MODAL BOOTSTRAP
// ==========================================
let modalInstancia = null; 

function mostrarModalBootstrap({ title, text, imageUrl, confirmText, cancelText, onConfirm }) {
    const modalEl = document.getElementById('modalWoof');
    if(!modalEl) return; 

    // 1. Textos
    document.getElementById('modalTitulo').innerText = title || 'Aviso';
    document.getElementById('modalMensaje').innerText = text || '';

    // 2. Imagen
    const imgEl = document.getElementById('modalImagen');
    if (imageUrl) {
        // Limpieza de ruta por si acaso
        let cleanUrl = imageUrl;
        if(cleanUrl.startsWith('..')) cleanUrl = cleanUrl.replace('..', '');
        
        imgEl.src = cleanUrl;
        imgEl.classList.remove('d-none');
    } else {
        imgEl.classList.add('d-none');
    }

    // 3. Botones
    const btnConfirmar = document.getElementById('btnConfirmar');
    const btnCancelar = document.getElementById('btnCancelar');

    btnConfirmar.innerText = confirmText || 'Aceptar';
    
    if (cancelText) {
        btnCancelar.innerText = cancelText;
        btnCancelar.classList.remove('d-none');
    } else {
        btnCancelar.classList.add('d-none');
    }

    // 4. Resetear eventos previos y asignar nuevo
    btnConfirmar.onclick = null; 
    btnConfirmar.onclick = function() {
        if (onConfirm) onConfirm(); 
        modalInstancia.hide();
    };

    // 5. Mostrar
    if (!modalInstancia) {
        modalInstancia = new bootstrap.Modal(modalEl);
    }
    modalInstancia.show();
}

// ==========================================
// B. CARGA DE DATOS (GET del Servidor)
// ==========================================

async function cargarCarritoDelServidor() {
    const contenedorItems = document.getElementById('listaItems');
    const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));

    if (!usuarioLogueado) {
        // Si no hay sesión, no cargamos nada o redirigimos
        return;
    }

    try {
        const response = await fetch(`${API_URL}/carrito/usuario/${usuarioLogueado.id}`);
        
        if (response.ok) {
            carritoActual = await response.json();
            
            // Renderizamos lista y calculamos totales iniciales
            renderizarCarritoUI(carritoActual.detalles || []);
            actualizarTotales(carritoActual);
            
            // Actualizar Badge del Navbar
            if(window.actualizarBadgeNavbar) window.actualizarBadgeNavbar();

        } else {
            console.error("Error al cargar carrito");
            contenedorItems.innerHTML = '<p class="text-center">Carrito vacío o error de carga.</p>';
        }
    } catch (e) {
        console.error("Error de conexión:", e);
        contenedorItems.innerHTML = '<p class="text-center">Error de conexión con el servidor.</p>';
    }
}

async function cargarInventarioCarrusel() {
    try {
        const response = await fetch(`${API_URL}/productos`);
        if (response.ok) {
            inventarioCompleto = await response.json();
            renderizarCarrusel(inventarioCompleto);
        }
    } catch (e) {
        console.error("No se pudo cargar el carrusel:", e);
    }
}

// ==========================================
// C. RENDERIZADO (Visual)
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
        actualizarTotales({ total: 0 }); 
        return;
    }

    // 2. Si hay productos
    if(estadoVacio) estadoVacio.classList.add('d-none');
    if(actionsBar) actionsBar.classList.remove('d-none');

    contenedorItems.innerHTML = '';
    
    // 3. Crear las cards
    detalles.forEach(detalle => {
        const producto = detalle.producto; 
        const totalItem = detalle.subtotal; 
        
        // Ajuste de ruta de imagen (Inteligente)
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

// FUNCIÓN MATEMÁTICA CORREGIDA (Usa variables globales del sidebar)
function actualizarTotales(carritoData) {
    // Referencias DOM
    const elSub = document.getElementById('rSubtotal');
    const elDes = document.getElementById('rDescuento');
    const elEnv = document.getElementById('rEnvio');
    const elIva = document.getElementById('rIva');
    const elTot = document.getElementById('rTotal');

    if (!elSub || !elTot) return;

    // 1. Calcular Subtotal (Recalculado desde detalles para mayor precisión)
    let subtotal = 0;
    if (carritoData.detalles && carritoData.detalles.length > 0) {
        subtotal = carritoData.detalles.reduce((acc, d) => {
            return acc + (d.producto.precio * d.cantidad);
        }, 0);
    }

    // 2. Aplicar Descuento (Cupón)
    const montoDescuento = subtotal * descuentoAplicado;
    const subtotalConDescuento = subtotal - montoDescuento;

    // 3. Calcular Envío (Regla > 499 o Manual)
    let costoEnvio = 0;
    if (subtotalConDescuento >= 499) {
        costoEnvio = 0; // Gratis
    } else if (costoEnvioManual !== null) {
        costoEnvio = costoEnvioManual; // Tarifa CP
    } else {
        costoEnvio = 150; // Default
    }

    // 4. Calcular IVA y Total
    const iva = subtotalConDescuento * 0.16;
    const granTotal = subtotalConDescuento + iva + costoEnvio;

    // 5. Pintar HTML
    const formato = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

    elSub.innerText = formato.format(subtotal);

    if (elDes) {
        elDes.innerText = `-${formato.format(montoDescuento)}`;
        if (montoDescuento > 0) {
            elDes.classList.add('text-success', 'fw-bold');
            elDes.classList.remove('text-muted');
        } else {
            elDes.classList.remove('text-success', 'fw-bold');
            elDes.classList.add('text-muted');
        }
    }

    if (elEnv) {
        if (costoEnvio === 0) {
            elEnv.innerHTML = '<span class="text-success fw-bold">Gratis</span>';
        } else {
            elEnv.innerText = formato.format(costoEnvio);
        }
    }

    if (elIva) elIva.innerText = formato.format(iva);
    elTot.innerText = formato.format(granTotal);
}

// ==========================================
// D. LÓGICA DEL SIDEBAR (CUPONES Y ENVÍO)
// ==========================================

window.aplicarCupon = function() {
    const inputCupon = document.getElementById('cupon');
    const feedback = document.getElementById('cuponFeedback');
    
    if(!inputCupon) return;

    const codigo = inputCupon.value.trim().toUpperCase();

    // Cupones simulados
    const cuponesValidos = { 'WOOF10': 0.10, 'BARF20': 0.20, 'JO': 0.50 };

    if (cuponesValidos[codigo]) {
        descuentoAplicado = cuponesValidos[codigo];
        feedback.innerHTML = `<span class="text-success small fw-bold"><i class="bi bi-check-circle"></i> Descuento aplicado!</span>`;
        inputCupon.classList.add('is-valid');
        inputCupon.classList.remove('is-invalid');
        inputCupon.disabled = true;
        document.getElementById('btnAplicarCupon').disabled = true;
    } else {
        descuentoAplicado = 0;
        feedback.innerHTML = `<span class="text-danger small">Cupón no válido.</span>`;
        inputCupon.classList.add('is-invalid');
    }
    // Recalcular con el nuevo estado
    actualizarTotales(carritoActual);
};

window.calcularEnvioCP = function() {
    const cpInput = document.getElementById('cp');
    const resultado = document.getElementById('cpResultado');
    if(!cpInput) return;

    const cp = cpInput.value.trim();

    if (cp.length === 5 && !isNaN(cp)) {
        if (cp.startsWith('0') || cp.startsWith('1')) { 
            costoEnvioManual = 100;
            resultado.innerHTML = '<span class="text-success small fw-bold">Envío Local: $100</span>';
        } else {
            costoEnvioManual = 180;
            resultado.innerHTML = '<span class="text-info small fw-bold">Envío Nacional: $180</span>';
        }
    } else {
        resultado.innerHTML = '<span class="text-danger small">CP inválido</span>';
        costoEnvioManual = null;
    }
    // Recalcular
    actualizarTotales(carritoActual);
};

// ==========================================
// E. CARRUSEL DE RECOMENDACIONES
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

        let slideHTML = `
            <div class="carousel-item ${claseActiva}">
                <div class="row justify-content-center g-3"> 
        `;

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
                </div>
            `;
        });
        slideHTML += `</div></div>`;
        contenedorCarrusel.innerHTML += slideHTML;
    }
}

// Agregar desde Carrusel (POST)
window.agregarDesdeCarrusel = async function(idProducto) {
    const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));
    
    if(!usuarioLogueado) {
        mostrarModalBootstrap({ title: 'Aviso', text: 'Inicia sesión para comprar.', confirmText: 'Ok' });
        return;
    }

    try {
        await fetch(`${API_URL}/carrito/agregar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idUsuario: usuarioLogueado.id, idProducto: idProducto, cantidad: 1 })
        });
        // Recargar para ver reflejado
        cargarCarritoDelServidor();
        
        // Modal Éxito
        const prod = inventarioCompleto.find(p => p.idProducto === idProducto);
        let rutaImg = prod ? prod.imagenUrl : null;
        if(rutaImg && rutaImg.startsWith('..')) rutaImg = rutaImg.replace('..', '');

        mostrarModalBootstrap({
            title: '¡Agregado!',
            text: 'Producto añadido al carrito.',
            imageUrl: rutaImg,
            confirmText: 'Genial'
        });

    } catch(e) { console.error(e); }
};

// ==========================================
// F. ACCIONES Y EL PUENTE DE PAGO
// ==========================================

window.eliminarItem = function(idDetalle) {
    mostrarModalBootstrap({
        title: '¿Eliminar?',
        text: 'Se quitará este producto.',
        confirmText: 'Sí, eliminar',
        cancelText: 'Cancelar',
        onConfirm: async () => {
            try {
                await fetch(`${API_URL}/carrito/detalle/${idDetalle}`, { method: 'DELETE' });
                cargarCarritoDelServidor(); 
            } catch (e) {
                console.error(e);
            }
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
            } catch (e) {
                console.error(e);
            }
        }
    });
};

// --- EL PUENTE (IR A PAGAR) ---
window.irAPagar = function() {
    if (!carritoActual.detalles || carritoActual.detalles.length === 0) {
        mostrarModalBootstrap({ title: 'Carrito Vacío', text: 'No hay productos.', confirmText: 'Ok' });
        return;
    }

    // 1. Crear Snapshot Plana para Datos.html
    const snapshot = carritoActual.detalles.map(d => ({
        id: d.producto.idProducto,
        name: d.producto.nombre,
        price: d.producto.precio,
        cantidad: d.cantidad,
        imageURL: d.producto.imagenUrl || ''
    }));

    // 2. Guardar en LocalStorage
    localStorage.setItem('carritoWoofBarf', JSON.stringify(snapshot));
    
    const totalTexto = document.getElementById('rTotal').innerText;
    localStorage.setItem('resumenPedido', JSON.stringify({ totalString: totalTexto }));

    // 3. Redirigir
    window.location.href = '/pages/carrito/datos.html'; 
};

// ==========================================
// G. INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    cargarCarritoDelServidor(); 
    cargarInventarioCarrusel(); 
    
    // Listeners Botones Generales
    const btnVaciar = document.getElementById('btnVaciar');
    if(btnVaciar) btnVaciar.addEventListener('click', window.vaciarCarrito);
    
    const btnPagar = document.getElementById('btnPagar');
    if(btnPagar) btnPagar.addEventListener('click', window.irAPagar);

    // Listeners Sidebar (Resumen)
    const btnCupon = document.getElementById('btnAplicarCupon');
    if(btnCupon) btnCupon.addEventListener('click', window.aplicarCupon);

    const btnCP = document.getElementById('btnCalcularCP');
    if(btnCP) btnCP.addEventListener('click', window.calcularEnvioCP);
});

window.addEventListener('resize', () => {
    if(inventarioCompleto.length > 0) {
        renderizarCarrusel(inventarioCompleto);
    }
});