// --- CONFIGURACIÓN BACKEND ---
const API_URL = 'http://localhost:8080/api/v1'; 

// Variable Global para guardar los datos
let carritoActual = { detalles: [], total: 0 }; 
let inventarioCompleto = []; // Para el carrusel

// ==========================================
// A. CARGA DE DATOS (GET del Servidor)
// ==========================================

async function cargarCarritoDelServidor() {
    const contenedorItems = document.getElementById('listaItems');
    const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));

    // 1. Verificar si hay usuario logueado
    if (!usuarioLogueado) {
        // Opción: Redirigir o mostrar carrito vacío
        // window.location.href = "iniciosesion.html"; 
        return;
    }

    try {
        // 2. Pedir carrito al Backend
        const response = await fetch(`${API_URL}/carrito/usuario/${usuarioLogueado.id}`);
        
        if (response.ok) {
            carritoActual = await response.json();
            
            // Renderizar lista y totales
            renderizarCarritoUI(carritoActual.detalles || []);
            actualizarTotales(carritoActual);
            
            // Actualizar Badge del Navbar (si existe la función)
            if(window.actualizarBadgeNavbar) window.actualizarBadgeNavbar();

        } else {
            console.error("Error al cargar carrito");
            contenedorItems.innerHTML = '<p class="text-center">No se pudo cargar tu carrito.</p>';
        }
    } catch (e) {
        console.error("Error de conexión:", e);
        contenedorItems.innerHTML = '<p class="text-center">Error de conexión con el servidor.</p>';
    }
}

// Cargar inventario para el carrusel (GET Productos)
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
        
        // Ajuste de imagen
        let rutaImg = producto.imagenUrl || '../assets/imagenes/iconos/logo-default.png';

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
    const subtotal = carrito.total || 0;
    
    // Regla de envío
    let costoEnvio = 99.00;
    if (subtotal >= 499) costoEnvio = 0;

    const totalFinal = subtotal + costoEnvio;

    if(document.getElementById('rSubtotal')) document.getElementById('rSubtotal').innerText = '$' + subtotal.toFixed(2);
    
    const labelEnvio = document.getElementById('rEnvio');
    if(labelEnvio) {
        if (costoEnvio === 0) {
            labelEnvio.innerText = 'Gratis';
            labelEnvio.classList.add('text-success', 'fw-bold');
        } else {
            labelEnvio.innerText = '$' + costoEnvio.toFixed(2);
            labelEnvio.classList.remove('text-success', 'fw-bold');
        }
    }

    if(document.getElementById('rTotal')) document.getElementById('rTotal').innerText = '$' + totalFinal.toFixed(2);
}

// ==========================================
// C. CARRUSEL DE RECOMENDACIONES (Restaurado)
// ==========================================

const contenedorCarrusel = document.getElementById('recoSlides');

function renderizarCarrusel(productos) {
    if(!contenedorCarrusel) return; 
    
    // Si no hay productos del backend, no mostramos nada o usamos fallback
    if (!productos || productos.length === 0) return;

    const listaCarrusel = productos.slice(0, 6); // Solo los primeros 6
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
            let rutaImg = prod.imagenUrl || '../assets/imagenes/iconos/logo-default.png';

            // Usamos la clase 'card-carrusel' que definimos en CSS para que se vea igual al catálogo
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

// Función auxiliar para agregar desde el carrusel (POST)
window.agregarDesdeCarrusel = async function(idProducto) {
    const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));
    if(!usuarioLogueado) return alert("Inicia sesión primero");

    try {
        await fetch(`${API_URL}/carrito/agregar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idUsuario: usuarioLogueado.id, idProducto: idProducto, cantidad: 1 })
        });
        // Recargar carrito para ver el nuevo item
        cargarCarritoDelServidor();
        alert("Producto agregado");
    } catch(e) { console.error(e); }
};


// ==========================================
// D. ACCIONES (Eliminar / Vaciar / Pagar)
// ==========================================

window.eliminarItem = async function(idDetalle) {
    if(!confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
        await fetch(`${API_URL}/carrito/detalle/${idDetalle}`, { method: 'DELETE' });
        cargarCarritoDelServidor(); 
    } catch (e) {
        console.error(e);
        alert("No se pudo eliminar.");
    }
};

window.vaciarCarrito = async function() {
    if(!confirm("¿Estás seguro de vaciar todo el carrito?")) return;
    const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));
    
    try {
        await fetch(`${API_URL}/carrito/vaciar/${usuarioLogueado.id}`, { method: 'DELETE' });
        cargarCarritoDelServidor(); 
    } catch (e) {
        console.error(e);
        alert("Error al vaciar.");
    }
};

// --- FUNCIÓN IR A PAGAR CORREGIDA ---
window.irAPagar = function() {
    // 1. Validar que haya productos
    if (!carritoActual.detalles || carritoActual.detalles.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    // 2. CREAR EL "SNAPSHOT" (Puente para las páginas estáticas)
    // Convertimos la estructura de Java a la estructura plana que esperan datos.html
    const productosParaCheckout = carritoActual.detalles.map(d => ({
        id: d.producto.idProducto,
        name: d.producto.nombre,
        price: d.producto.precio,
        cantidad: d.cantidad,
        imageURL: d.producto.imagenUrl || ''
    }));

    // 3. Guardar en LocalStorage para que datos.html lo lea
    localStorage.setItem('carritoWoofBarf', JSON.stringify(productosParaCheckout));
    
    const totalTexto = document.getElementById('rTotal').innerText;
    localStorage.setItem('resumenPedido', JSON.stringify({ totalString: totalTexto }));

    // 4. Redirección Real
    window.location.href = '/pages/carrito/datos.html'; 
};


// ==========================================
// E. INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    cargarCarritoDelServidor();   // Cargar items del carrito
    cargarInventarioCarrusel();   // Cargar productos para el carrusel
    
    const btnVaciar = document.getElementById('btnVaciar');
    if(btnVaciar) btnVaciar.addEventListener('click', window.vaciarCarrito);
    
    const btnPagar = document.getElementById('btnPagar');
    if(btnPagar) btnPagar.addEventListener('click', window.irAPagar);
});

// Listener Resize para el carrusel
window.addEventListener('resize', () => {
    if(inventarioCompleto.length > 0) {
        renderizarCarrusel(inventarioCompleto);
    }
});