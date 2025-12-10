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
    // 1. CARGAR DATOS DEL CARRITO
    const carrito = JSON.parse(localStorage.getItem('carritoWoofBarf')) || [];
    const resumenGuardado = JSON.parse(localStorage.getItem('resumenPedido'));

    if (carrito.length === 0) {
        // Redirige al carrito si está vacío (ajustado a la ruta relativa correcta)
        window.location.href = '../carrito.html'; 
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

            // Verificamos si NO es una URL de internet
            if (!rutaFinal.startsWith('http')) {
                rutaFinal = rutaFinal.replace('..', '');
                if (!rutaFinal.startsWith('/')) {
                    rutaFinal = '/' + rutaFinal;
                }
            }

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

    // ---------------------------------------------------------
    // --- NUEVO: AUTOCOMPLETADO POR CP (API COPOMEX) ---
    // ---------------------------------------------------------
    const inputCP = document.getElementById('cp');
    if (inputCP) {
        inputCP.addEventListener('input', function() {
            const cp = this.value;
            
            // Solo consultamos si tiene 5 dígitos exactos
            if (cp.length === 5 && /^\d+$/.test(cp)) {
                // Feedback visual de carga (opcional)
                document.getElementById('estado').style.opacity = '0.5';

                fetch(`https://api.copomex.com/query/info_cp/${cp}?token=pruebas`)
                    .then(response => response.json())
                    .then(data => {
                        document.getElementById('estado').style.opacity = '1';
                        
                        if (!data.error) {
                            const estadoSelect = document.getElementById('estado');
                            const estadoApi = data[0].response.estado; // Ej: "Ciudad de México"
                            
                            // Buscar la opción que coincida con el texto del API
                            for (let i = 0; i < estadoSelect.options.length; i++) {
                                // Comparamos ignorando mayúsculas/minúsculas y acentos si es necesario
                                let opcionTexto = estadoSelect.options[i].text.toUpperCase();
                                let apiTexto = estadoApi.toUpperCase();

                                if (opcionTexto.includes(apiTexto) || apiTexto.includes(opcionTexto)) {
                                    estadoSelect.selectedIndex = i;
                                    // Quitamos error visual si existía
                                    estadoSelect.classList.remove('is-invalid');
                                    break;
                                }
                            }
                        }
                    })
                    .catch(error => {
                        console.error('Error al buscar CP:', error);
                        document.getElementById('estado').style.opacity = '1';
                    });
            }
        });
    }
    // ---------------------------------------------------------

    // 3. VALIDACIÓN Y ENVÍO DEL FORMULARIO
    const formulario = document.getElementById('formDatosEnvio');

    formulario.addEventListener('submit', function(event) {
        // Obtenemos inputs
        const nombreInput = document.getElementById('nombre');
        const apellidoInput = document.getElementById('apellido');
        const direccionInput = document.getElementById('direccion');
        const coloniaInput = document.getElementById('colonia');
        const telefonoInput = document.getElementById('telefono');
        const estadoInput = document.getElementById('estado'); // Agregado para validación

        // --- RESETEAR ERRORES PREVIOS ---
        [nombreInput, apellidoInput, direccionInput, coloniaInput, telefonoInput, estadoInput].forEach(input => {
            if(input) input.setCustomValidity(""); 
        });

        // --- APLICAR VALIDACIONES JS ---
        if (!esTextoValido(nombreInput.value)) nombreInput.setCustomValidity("Nombre incoherente."); 
        if (!esTextoValido(apellidoInput.value)) apellidoInput.setCustomValidity("Apellido incoherente.");
        if (!esTextoValido(direccionInput.value)) direccionInput.setCustomValidity("Dirección incoherente.");
        if (!esTextoValido(coloniaInput.value)) coloniaInput.setCustomValidity("Colonia incoherente.");
        if (!esTelefonoValido(telefonoInput.value)) telefonoInput.setCustomValidity("Número de teléfono inválido.");
        if (estadoInput.value === "") estadoInput.setCustomValidity("Selecciona un estado.");

        // --- VERIFICACIÓN FINAL ---
        if (!formulario.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
            formulario.classList.add('was-validated'); 
            return;
        }

        // SI PASA TODO, GUARDAMOS:
        event.preventDefault(); 
        
        const datosUsuario = {
            email: document.getElementById('email').value,
            nombre: nombreInput.value.trim(),
            apellido: apellidoInput.value.trim(),
            direccion: direccionInput.value.trim(),
            colonia: coloniaInput.value.trim(),
            estado: estadoInput.value, // Ahora guardamos el valor del select
            estadoTexto: estadoInput.options[estadoInput.selectedIndex].text, // Guardamos el nombre completo también por si acaso
            cp: document.getElementById('cp').value,
            telefono: telefonoInput.value.trim()
        };

        localStorage.setItem('datosEnvioWoof', JSON.stringify(datosUsuario));

        // Loading UI
        const botonSubmit = formulario.querySelector('button[type="submit"]');
        botonSubmit.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...';
        botonSubmit.disabled = true;

        setTimeout(() => {
            window.location.href = 'pago.html';
        }, 1000);
    });

    // LIMPIEZA EN TIEMPO REAL
    ['nombre', 'apellido', 'direccion', 'colonia', 'telefono', 'cp'].forEach(id => {
        const input = document.getElementById(id);
        if(input) {
            input.addEventListener('input', function() {
                this.setCustomValidity(""); 
            });
        }
    });
});
