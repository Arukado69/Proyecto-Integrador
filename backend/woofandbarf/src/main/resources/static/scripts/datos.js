// A. VALIDACIONES LÓGICAS
function esTextoValido(texto) {
    if (!texto) return false;
    // Regex: Falla si encuentra 3 caracteres idénticos seguidos (ej: "aaa")
    const repetidos = /(.)\1{2,}/;
    return !repetidos.test(texto);
}

function esTelefonoValido(telefono) {
    // Falla si no son 10 dígitos, si son todos iguales, o si es la serie 1234567890
    if (!/^\d{10}$/.test(telefono)) return false;
    if (/^(\d)\1+$/.test(telefono)) return false;
    if (telefono === "1234567890") return false;
    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. CARGAR DATOS
    const carrito = JSON.parse(localStorage.getItem('carritoWoofBarf')) || [];
    const resumenGuardado = JSON.parse(localStorage.getItem('resumenPedido'));

    if (carrito.length === 0) {
        window.location.href = './carrito.html';
        return;
    }

    // 2. RENDERIZAR MINI RESUMEN
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

    // 3. VALIDACIÓN Y ENVÍO (Lógica Corregida)
    const formulario = document.getElementById('formDatosEnvio');

    formulario.addEventListener('submit', function(event) {
        // Obtenemos inputs
        const nombreInput = document.getElementById('nombre');
        const apellidoInput = document.getElementById('apellido');
        const direccionInput = document.getElementById('direccion');
        const coloniaInput = document.getElementById('colonia');
        const telefonoInput = document.getElementById('telefono');

        // --- PASO CLAVE: RESETEAR ERRORES PREVIOS ---
        // Le decimos al navegador: "Por ahora, todo parece válido"
        [nombreInput, apellidoInput, direccionInput, coloniaInput, telefonoInput].forEach(input => {
            input.setCustomValidity(""); 
        });

        // --- APLICAR VALIDACIONES JS ---
        // Si falla JS, usamos setCustomValidity("Error"). 
        // Esto obliga al navegador a marcarlo como inválido (X Roja).

        if (!esTextoValido(nombreInput.value)) {
            nombreInput.setCustomValidity("Nombre incoherente."); 
        }

        if (!esTextoValido(apellidoInput.value)) {
            apellidoInput.setCustomValidity("Apellido incoherente.");
        }

        if (!esTextoValido(direccionInput.value)) {
            direccionInput.setCustomValidity("Dirección incoherente.");
        }

        if (!esTextoValido(coloniaInput.value)) {
            coloniaInput.setCustomValidity("Colonia incoherente.");
        }

        if (!esTelefonoValido(telefonoInput.value)) {
            telefonoInput.setCustomValidity("Número de teléfono inválido.");
        }

        // --- VERIFICACIÓN FINAL ---
        // checkValidity() ahora revisará tanto el HTML (pattern) como nuestros CustomValidity
        if (!formulario.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
            formulario.classList.add('was-validated'); // Esto activa los colores (Rojo si hay error, Verde si no)
            return;
        }

        // SI PASA TODO, GUARDAMOS:
        event.preventDefault(); // Detenemos submit real
        
        const datosUsuario = {
            email: document.getElementById('email').value,
            nombre: nombreInput.value.trim(),
            apellido: apellidoInput.value.trim(),
            direccion: direccionInput.value.trim(),
            colonia: coloniaInput.value.trim(),
            estado: document.getElementById('estado').value,
            cp: document.getElementById('cp').value,
            telefono: telefonoInput.value.trim()
        };

        localStorage.setItem('datosEnvioWoof', JSON.stringify(datosUsuario));

        // Loading UI
        const botonSubmit = formulario.querySelector('button[type="submit"]');
        botonSubmit.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...';
        botonSubmit.disabled = true;

        setTimeout(() => {
            window.location.href = './pago.html';
        }, 1000);
    });

    // LIMPIEZA EN TIEMPO REAL
    // Cuando el usuario escribe, quitamos el error inmediatamente
    ['nombre', 'apellido', 'direccion', 'colonia', 'telefono'].forEach(id => {
        const input = document.getElementById(id);
        if(input) {
            input.addEventListener('input', function() {
                this.setCustomValidity(""); // Quitamos el error interno
                // Opcional: si quieres que se quite el rojo visualmente al instante:
                // formulario.classList.remove('was-validated'); 
            });
        }
    });
});

