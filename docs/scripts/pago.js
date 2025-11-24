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
            // Rutas absolutas para imágenes
            const rutaImg = item.imageURL.replace('..', ''); 

            contenedorItems.innerHTML += `
                <div class="d-flex align-items-center gap-2 mb-2">
                    <div style="width: 40px; height: 40px;" class="bg-white rounded border p-1 flex-shrink-0">
                        <img src="${rutaImg}" class="w-100 h-100 object-fit-cover rounded" onerror="this.style.display='none'">
                    </div>
                    <div class="flex-grow-1 lh-sm">
                        <div class="small fw-semibold text-truncate" style="max-width: 140px;">${item.name}</div>
                        <div class="text-muted" style="font-size: 0.7rem;">x${item.cantidad}</div>
                    </div>
                </div>`;
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