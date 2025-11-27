document.addEventListener('DOMContentLoaded', () => {
    
    // 1. VERIFICACIÓN DE SEGURIDAD (¿Vienes de los pasos anteriores?)
    const carrito = JSON.parse(localStorage.getItem('carritoWoofBarf')) || [];
    const datosEnvio = JSON.parse(localStorage.getItem('datosEnvioWoof'));
    const resumenGuardado = JSON.parse(localStorage.getItem('resumenPedido'));

    if (carrito.length === 0) {
        window.location.href = '/pages/carrito/carrito.html'; // De vuelta al inicio
        return;
    }
    if (!datosEnvio) {
        alert("Faltan tus datos de envío.");
        window.location.href = '/pages/carrito/datos.html'; // De vuelta al paso 2
        return;
    }

    // 2. RENDERIZAR RESUMEN LATERAL
    // A. Productos
    const contenedorItems = document.getElementById('listaMiniResumen');
    if (contenedorItems) {
        contenedorItems.innerHTML = '';
        let subtotalCalculado = 0;
        
        carrito.forEach(item => {
            const totalItem = item.price * item.cantidad;
            subtotalCalculado += totalItem;

            // --- LÓGICA INTELIGENTE DE IMAGEN ---
            let rutaFinal = item.imageURL;

            // 1. Verificamos si NO es una URL de internet (http/https)
            if (!rutaFinal.startsWith('http')) {
                // Es una ruta local antigua (ej: ../assets/...)
                // La limpiamos para que sea absoluta desde la raíz
                rutaFinal = rutaFinal.replace('..', '');
                
                // Aseguramos que empiece con / si no lo tiene
                if (!rutaFinal.startsWith('/')) {
                    rutaFinal = '/' + rutaFinal;
                }
            }
            // Si SÍ empieza con http, la dejamos intacta (es lo que ingresaste en el form)

            contenedorItems.innerHTML += `
                <div class="d-flex align-items-center py-2 border-bottom border-light">
                    
                    <div style="width: 60px; height: 60px; flex-shrink: 0;" class="bg-white rounded border p-1">
                        <img src="${rutaFinal}" 
                             alt="${item.name}" 
                             style="width: 100%; height: 100%; object-fit: cover;"
                             class="rounded"
                             onerror="this.src='https://via.placeholder.com/60?text=Sin+Foto'">
                    </div>
        
                    <div class="flex-grow-1 ms-3">
                        <h6 class="small fw-bold text-dark mb-1 text-truncate" style="max-width: 150px;">
                            ${item.name}
                        </h6>
                        <div class="text-muted small">
                            Cant: <span class="fw-semibold text-dark">${item.cantidad}</span>
                        </div>
                    </div>

                    <div class="small fw-bold text-end ms-2">
                        $${totalItem.toFixed(2)}
                    </div>
                </div>
            `;
        });

        // B. Totales (Leemos lo que calculó el carrito para ser exactos)
        if (resumenGuardado && resumenGuardado.totalString) {
            document.getElementById('resumenTotal').innerText = resumenGuardado.totalString;
            document.getElementById('btnTotalDisplay').innerText = resumenGuardado.totalString.replace('$',''); // Para el botón
            document.getElementById('resumenSubtotal').innerText = '$' + subtotalCalculado.toFixed(2);
            document.getElementById('resumenEnvio').innerText = 'Ver detalle';
        }

        // C. Dirección de envío (Feedback visual)
        if(datosEnvio) {
            document.getElementById('resumenDireccion').innerText = 
                `${datosEnvio.direccion}, ${datosEnvio.cp}, ${datosEnvio.estado}.`;
        }
    }

    // 3. INTERACTIVIDAD DE MÉTODOS DE PAGO (Acordeón manual)
    const radiosPago = document.querySelectorAll('input[name="metodoPago"]');
    const collapseTarjeta = document.getElementById('collapseTarjeta');
    const collapsePaypal = document.getElementById('collapsePaypal');
    const collapseOxxo = document.getElementById('collapseOxxo');
    const inputsTarjeta = collapseTarjeta.querySelectorAll('input'); // Para activar/desactivar 'required'

    radiosPago.forEach(radio => {
        radio.addEventListener('change', (e) => {
            // Ocultar todos primero
            collapseTarjeta.classList.remove('show');
            collapsePaypal.classList.remove('show');
            collapseOxxo.classList.remove('show');
            
            // Quitar 'required' de la tarjeta si no se usa (para que no bloquee el submit)
            inputsTarjeta.forEach(input => input.required = false);

            if (e.target.value === 'tarjeta') {
                collapseTarjeta.classList.add('show');
                inputsTarjeta.forEach(input => input.required = true);
            } else if (e.target.value === 'paypal') {
                collapsePaypal.classList.add('show');
            } else {
                collapseOxxo.classList.add('show');
            }
        });
    });

    // 4. PROCESAR PAGO (SUBMIT)
    const formPago = document.getElementById('formPago');
    
    formPago.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!formPago.checkValidity()) {
            e.stopPropagation();
            formPago.classList.add('was-validated');
            return;
        }

        // SIMULACIÓN DE PROCESO DE PAGO
        const btn = document.getElementById('btnFinalizarPedido');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Verificando banco...';

        setTimeout(() => {
            // ÉXITO
            
            // 1. Crear Objeto de Orden Final
            const orden = {
                id: 'ORD-' + Math.floor(Math.random() * 1000000), // ID falso
                fecha: new Date().toLocaleDateString(),
                total: document.getElementById('resumenTotal').innerText,
                metodo: document.querySelector('input[name="metodoPago"]:checked').value,
                cliente: datosEnvio,
                items: carrito
            };

            // 2. Guardar orden (para mostrarla en la confirmación)
            localStorage.setItem('ordenRecienteWoof', JSON.stringify(orden));

            // 3. LIMPIAR EL CARRITO (¡Ya compró!)
            // localStorage.removeItem('carritoWoofBarf'); 
            // NOTA: Mejor lo borramos en la página de confirmación para que 
            // si el usuario da "Atrás", no se le borre todo. 
            // Pero por seguridad lo haremos allá.

            // 4. Redirección
            window.location.href = '/pages/carrito/confirmacion.html';

        }, 2000); // 2 segundos de espera simulada
    });

    // Formateo visual simple para tarjeta (Espacios cada 4 números)
    const inputCC = document.getElementById('cc-numero');
    if(inputCC){
        inputCC.addEventListener('input', function (e) {
            e.target.value = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
        });
    }
});