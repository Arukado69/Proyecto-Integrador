(function () {
    const $ = (sel) => document.querySelector(sel);

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

    // --- 1. LÓGICA DE BASE DE DATOS LOCAL (Simulada) ---
    
    // Clave donde guardaremos TODO el inventario
    const CLAVE_BD = 'baseDatosProductos'; 

    function obtenerProductosBD() {
        const guardados = localStorage.getItem(CLAVE_BD);
        // Si ya hay datos, los devolvemos. Si no, devolvemos un array vacío.
        // NOTA: Aquí podrías inicializarlo con tus datos de prueba si está vacío.
        return guardados ? JSON.parse(guardados) : [];
    }

    function guardarProductoEnBD(producto) {
        const productos = obtenerProductosBD();
        productos.push(producto);
        localStorage.setItem(CLAVE_BD, JSON.stringify(productos));
    }

    function generarId() {
        // Generamos un ID basado en la fecha actual (es único y fácil)
        return Date.now(); 
    }

    // --- 2. UTILIDADES DEL FORMULARIO ---

    // Autocompletar nombre
    function autocompletarNombre() {
        if (!nombre.value.trim() && sabor.value && tamano.value) {
            nombre.value = `Menú de ${sabor.value} ${tamano.value}`;
        }
    }
    sabor.addEventListener('change', autocompletarNombre);
    tamano.addEventListener('change', autocompletarNombre);

    // Alertas Bootstrap
    function showAlert(tipo, mensaje) {
        alerta.className = `alert alert-${tipo} fade show`;
        alerta.textContent = mensaje;
        alerta.classList.remove('d-none');
        
        // Ocultar automáticamente después de 3 seg
        setTimeout(() => {
            alerta.classList.add('d-none');
        }, 3000);
    }

    function validarURL(url) {
        // Validación simple de URL o ruta relativa
        return url.includes('/') || url.startsWith('http');
    }

    // --- 3. PROCESAR EL ENVÍO ---

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        form.classList.add('was-validated'); // Activa estilos rojos de Bootstrap

        // Validaciones básicas
        if (!form.checkValidity()) {
            showAlert('danger', 'Por favor completa todos los campos requeridos.');
            return;
        }

        // Construir el objeto producto
        const nuevoProducto = {
            id: generarId(),
            name: nombre.value.trim(),
            price: Number(precio.value),
            description: descripcion.value.trim(),
            imageURL: imagen.value.trim(), // Guardamos la ruta tal cual
            size: tamano.value,
            flavor: sabor.value,
            category: categoria.value,
            stock: Number(stock.value || 0),
            sku: sku.value.trim() || `WBF-${Math.floor(Math.random() * 10000)}`
        };

        // Guardar en LocalStorage
        guardarProductoEnBD(nuevoProducto);

        // Feedback
        showAlert('success', '¡Producto guardado exitosamente! Revisa el catálogo.');
        form.reset();
        form.classList.remove('was-validated');
    });

    // Limpiar formulario
    btnLimpiar.addEventListener('click', () => {
        form.reset();
        form.classList.remove('was-validated');
        alerta.classList.add('d-none');
    });

})();