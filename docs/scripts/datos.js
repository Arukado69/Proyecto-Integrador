// Función auxiliar para detectar letras repetidas (ej: "jjj", "aaa")
// Retorna FALSE si encuentra 3 caracteres idénticos seguidos
function esTextoValido(texto) {
    if (!texto) return false;
    // La regex /(.)\1{2,}/ busca cualquier caracter (.) seguido del MISMO (\1) 2 veces más
    const repetidos = /(.)\1{2,}/;
    return !repetidos.test(texto);
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. CARGAR DATOS DEL LOCALSTORAGE
    const carrito = JSON.parse(localStorage.getItem('carritoWoofBarf')) || [];
    const resumenGuardado = JSON.parse(localStorage.getItem('resumenPedido'));

    // Protección: Si no hay carrito, mandar al inicio
    if (carrito.length === 0) {
        window.location.href = './carrito.html';
        return;
    }

    // 2. RENDERIZAR MINI RESUMEN (SIDEBAR)
    const contenedorItems = document.getElementById('listaMiniResumen');
    if (contenedorItems) {
        contenedorItems.innerHTML = '';
        let subtotalCalculado = 0;

        carrito.forEach(item => {
            const totalItem = item.price * item.cantidad;
            subtotalCalculado += totalItem;

            contenedorItems.innerHTML += `
                <div class="d-flex align-items-center gap-2">
                    <div style="width: 50px; height: 50px; background: #fff; border-radius: 6px; overflow: hidden; flex-shrink: 0; border: 1px solid #eee;">
                        <img src="${item.imageURL}" alt="producto" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div class="flex-grow-1 lh-1">
                        <div class="small fw-semibold text-truncate" style="max-width: 160px;">${item.name}</div>
                        <div class="text-muted" style="font-size: 0.75rem;">Cant: ${item.cantidad}</div>
                    </div>
                    <div class="small fw-bold">$${totalItem.toFixed(2)}</div>
                </div>
            `;
        });

        // 3. MOSTRAR TOTALES
        const elTotal = document.getElementById('resumenTotal');
        const elSub = document.getElementById('resumenSubtotal');
        const elEnv = document.getElementById('resumenEnvio');

        if (resumenGuardado && resumenGuardado.totalString) {
            elTotal.innerText = resumenGuardado.totalString;
            elSub.innerText = '$' + subtotalCalculado.toFixed(2);
            elEnv.innerText = 'Calculado previamente';
        } else {
            elTotal.innerText = '$' + subtotalCalculado.toFixed(2);
        }
    }

    // 4. MANEJO DEL FORMULARIO CON VALIDACIÓN AVANZADA
    const formulario = document.getElementById('formDatosEnvio');

    formulario.addEventListener('submit', function(event) {
        // A. Detenemos el envío automático siempre al principio
        event.preventDefault();

        // B. Obtenemos valores clave para validar
        const nombreInput = document.getElementById('nombre');
        const apellidoInput = document.getElementById('apellido');
        
        const nombreVal = nombreInput.value.trim();
        const apellidoVal = apellidoInput.value.trim();

        // C. Validación Personalizada (JavaScript)
        let esValidoJS = true;

        // Validar Nombre (Anti "jjjj")
        if (!esTextoValido(nombreVal)) {
            nombreInput.classList.add('is-invalid'); // Pone el borde rojo
            // Opcional: Mostrar alerta o dejar que el usuario vea el borde rojo
            // alert("El nombre contiene letras repetidas incorrectas.");
            esValidoJS = false;
        }

        // Validar Apellido (Anti "aaaa")
        if (!esTextoValido(apellidoVal)) {
            apellidoInput.classList.add('is-invalid');
            esValidoJS = false;
        }

        // D. Verificación Final: ¿Pasó HTML (Bootstrap) Y JavaScript?
        if (!formulario.checkValidity() || !esValidoJS) {
            event.stopPropagation();
            formulario.classList.add('was-validated'); // Muestra los mensajes de error de Bootstrap
            return; // ¡DETENEMOS TODO AQUÍ!
        }

        // E. SI TODO ESTÁ CORRECTO, GUARDAMOS
        const datosUsuario = {
            email: document.getElementById('email').value,
            nombre: nombreVal,
            apellido: apellidoVal,
            direccion: document.getElementById('direccion').value,
            colonia: document.getElementById('colonia').value, // Agregué colonia que estaba en tu HTML
            estado: document.getElementById('estado').value,
            cp: document.getElementById('cp').value,
            telefono: document.getElementById('telefono').value
        };

        localStorage.setItem('datosEnvioWoof', JSON.stringify(datosUsuario));

        // Feedback Visual
        const botonSubmit = formulario.querySelector('button[type="submit"]');
        botonSubmit.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...';
        botonSubmit.disabled = true;

        // Redirección
        setTimeout(() => {
            window.location.href = './pago.html';
        }, 1000);
    });

    // 5. UX: Limpiar errores en tiempo real
    // Si el usuario tenía error en nombre y empieza a escribir, quitamos el rojo
    ['nombre', 'apellido', 'direccion', 'cp', 'telefono'].forEach(id => {
        const input = document.getElementById(id);
        if(input) {
            input.addEventListener('input', function() {
                this.classList.remove('is-invalid');
                formulario.classList.remove('was-validated'); 
            });
        }
    });
});