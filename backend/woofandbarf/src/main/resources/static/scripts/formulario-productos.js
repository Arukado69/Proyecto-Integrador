document.addEventListener("DOMContentLoaded", () => {

    const btnAgregar = document.getElementById("btnAgregar");
    const btnLimpiar = document.getElementById("btnLimpiar");
    const form = document.getElementById("formProducto");
    const alerta = document.getElementById("alerta");

    // --- FUNCIÓN PARA MOSTRAR ALERTAS (Reutilizada del diseño original) ---
    function mostrarAlerta(tipo, mensaje) {
        // tipo puede ser 'success' (verde) o 'danger' (rojo)
        alerta.className = `alert alert-${tipo} fade show`;
        alerta.textContent = mensaje;
        alerta.classList.remove('d-none');
        
        // Ocultar la alerta después de 3 segundos
        setTimeout(() => { alerta.classList.add('d-none'); }, 3000);
    }

    // --- LÓGICA PRINCIPAL ---
    if (btnAgregar) {
        btnAgregar.addEventListener("click", (e) => {
            e.preventDefault(); // Evita recarga de página

            // 1. OBTENER VALORES
            const nombreInput = document.getElementById("nombre").value.trim();
            const precioInput = document.getElementById("precio").value.trim();
            const descripcionInput = document.getElementById("descripcion").value.trim();
            const tamanoInput = document.getElementById("tamano").value;
            const saborInput = document.getElementById("sabor").value;
            const categoriaInput = document.getElementById("categoria").value;
            const imageInput = document.getElementById("imagen").value.trim();
            const stockInput = document.getElementById("stock").value;

            // 2. VALIDACIÓN
            if (!nombreInput || !precioInput || !descripcionInput || !tamanoInput || !saborInput || !categoriaInput || !imageInput) {
                mostrarAlerta("danger", "Por favor, completa todos los campos obligatorios.");
                return;
            }

            // 3. CREAR OBJETO JSON (Coincide con Producto.java)
            const producto = {
                nombre: nombreInput,
                precio: parseFloat(precioInput),
                descripcion: descripcionInput,
                tamano: tamanoInput,
                sabor: saborInput,
                categoria: categoriaInput,
                imagenUrl: imageInput,
                stock: parseInt(stockInput) || 0,
                activo: true
            };

            // 4. CONEXIÓN AL BACKEND
            // Corregí tu error de URL: faltaban las diagonales // después de http:
            const url = "http://52.15.203.222:8080/api/v1/productos/new-producto";

            fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(producto)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en la respuesta del servidor");
                }
                return response.json();
            })
            .then(data => {
                console.log("Producto creado:", data);
                
                // ÉXITO VISUAL
                mostrarAlerta("success", "¡Producto agregado al catálogo correctamente!");
                form.reset(); // Limpia los campos
            })
            .catch(error => {
                console.error("Error:", error);
                mostrarAlerta("danger", "Hubo un error al conectar con el servidor.");
            });
        });
    }

    // --- BOTÓN LIMPIAR (Funcionalidad extra útil) ---
    if (btnLimpiar) {
        btnLimpiar.addEventListener("click", () => {
            form.reset();
            alerta.classList.add('d-none');
        });
    }
});