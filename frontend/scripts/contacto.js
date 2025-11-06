// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const alertPlaceholder = document.getElementById('alertPlaceholder');

    // Función para mostrar la alerta
    const appendAlert = (message, type) => {
        // Creamos el HTML de la alerta de Bootstrap
        const wrapper = document.createElement('div');
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>',
            '</div>'
        ].join('');

        // Limpiamos alertas anteriores y añadimos la nueva
        alertPlaceholder.innerHTML = '';
        alertPlaceholder.append(wrapper);
    };

    // Manejador del evento de envío del formulario
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Detiene el envío real del formulario

        // Simulamos la validación (Bootstrap ya maneja la validación de 'required')
        if (contactForm.checkValidity()) {
            // Si es válido, simulamos el envío exitoso y mostramos la alerta de éxito
            
            appendAlert('¡Mensaje enviado con éxito! Pronto nos pondremos en contacto contigo.', 'success');
            
            // Opcional: Limpiar el formulario después del envío
            contactForm.reset();
            
        } else {
            // Si falla la validación (aunque Bootstrap lo maneja visualmente), podríamos poner una alerta de error.
            // Para este ejemplo, solo usaremos la alerta de éxito después de pasar la validación.
            event.stopPropagation();
        }
        
        // Aplica las clases de validación de Bootstrap
        contactForm.classList.add('was-validated');
    });
});