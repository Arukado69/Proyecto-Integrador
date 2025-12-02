document.addEventListener("DOMContentLoaded", () => {
    
    const form = document.getElementById("formEliminar");
    const inputId = document.getElementById("idProducto");
    const alerta = document.getElementById("alerta");

    // Función para mostrar mensajes bonitos
    function mostrarAlerta(tipo, mensaje) {
        alerta.className = `alert alert-${tipo}`; // 'success' (verde) o 'danger' (rojo)
        alerta.textContent = mensaje;
        alerta.classList.remove("d-none");
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const id = inputId.value.trim();

        // 1. Validar que escribió un número
        if (!id) {
            mostrarAlerta("warning", "Por favor escribe un ID.");
            return;
        }

        // 2. Confirmación de seguridad (Vital para borrar cosas)
        const confirmacion = confirm(`⚠️ ¿Estás SEGURO que deseas eliminar el producto con ID ${id}?\n\nEsta acción no se puede deshacer.`);
        
        if (!confirmacion) {
            return; // Si dice "Cancelar", no hacemos nada
        }

        // 3. Conexión al Backend
        const url = `http://52.15.203.222:8080/api/v1/productos/${id}`;

        try {
            const response = await fetch(url, {
                method: "DELETE"
            });

            if (response.ok) {
                // Éxito (Status 200 o 204)
                mostrarAlerta("success", `¡Producto ID ${id} eliminado correctamente!`);
                form.reset();
            } else if (response.status === 404) {
                // Error 404: El ID no existe
                mostrarAlerta("warning", "No se encontró ningún producto con ese ID.");
            } else {
                // Error 500: Probablemente tiene pedidos asociados (Foreign Key)
                mostrarAlerta("danger", "Error: No se puede borrar. Posiblemente este producto está en el carrito de alguien.");
            }

        } catch (error) {
            console.error(error);
            mostrarAlerta("danger", "Error de conexión con el servidor.");
        }
    });
});