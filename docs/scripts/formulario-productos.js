(function () {
    const $ = (sel) => document.querySelector(sel);

    // --- CONFIGURACIÓN BACKEND ---
    const API_URL = 'http://localhost:8080/api'; // Ajustar el puerto si es necesario

    // DOM Elements
    const form = $('#formProducto');
    const alerta = $('#alerta');
    
    // Inputs
    const nombre = $('#nombre');
    const precio = $('#precio');
    const descripcion = $('#descripcion');
    const tamano = $('#tamano');
    const sabor = $('#sabor');
    const categoria = $('#categoria');
    const imagen = $('#imagen');
    const stock = $('#stock');
    const sku = $('#sku');
    const btnLimpiar = $('#btnLimpiar');

    // --- 1. LÓGICA DE BACKEND (POST) ---
    
    async function guardarProductoEnBackend(producto) {
        try {
            const response = await fetch(`${API_URL}/productos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(producto)
            });

            if (response.ok) {
                showAlert('success', '¡Producto guardado en la Base de Datos!');
                form.reset();
                form.classList.remove('was-validated');
            } else {
                showAlert('danger', 'Error del servidor al guardar el producto.');
                console.error('Error server:', await response.text());
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            showAlert('danger', 'No se pudo conectar con el servidor (Spring Boot).');
        }
    }

    // --- 2. UTILIDADES ---

    function autocompletarNombre() {
        if (!nombre.value.trim() && sabor.value && tamano.value) {
            nombre.value = `Menú de ${sabor.value} ${tamano.value}`;
        }
    }
    sabor.addEventListener('change', autocompletarNombre);
    tamano.addEventListener('change', autocompletarNombre);

    function showAlert(tipo, mensaje) {
        alerta.className = `alert alert-${tipo} fade show`;
        alerta.textContent = mensaje;
        alerta.classList.remove('d-none');
        setTimeout(() => { alerta.classList.add('d-none'); }, 3000);
    }

    function validarURL(url) {
        return url.includes('/') || url.startsWith('http');
    }

    // --- 3. PROCESAR EL ENVÍO ---

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        form.classList.add('was-validated');

        if (!form.checkValidity()) {
            showAlert('danger', 'Por favor completa los campos requeridos.');
            return;
        }

        // Construir objeto (DTO para Java)
        const nuevoProducto = {
            // Nota: ID lo suele generar la base de datos (AutoIncrement), no lo enviamos aquí
            name: nombre.value.trim(),
            price: Number(precio.value),
            description: descripcion.value.trim(),
            imageURL: imagen.value.trim(),
            size: tamano.value,
            flavor: sabor.value,
            category: categoria.value,
            stock: Number(stock.value || 0),
            sku: sku.value.trim() || `WBF-${Date.now().toString().slice(-5)}`
        };

        // Enviar a Java
        guardarProductoEnBackend(nuevoProducto);
    });

    btnLimpiar.addEventListener('click', () => {
        form.reset();
        form.classList.remove('was-validated');
        alerta.classList.add('d-none');
    });

})();