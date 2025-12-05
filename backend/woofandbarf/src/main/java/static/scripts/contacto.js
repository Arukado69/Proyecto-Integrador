document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const alertPlaceholder = document.getElementById('alertPlaceholder');
    const submitButton = contactForm.querySelector('button[type="submit"]');

    // Función para mostrar la alerta
    const appendAlert = (message, type) => {
        alertPlaceholder.innerHTML = ''; // Limpiamos alertas anteriores
        const wrapper = document.createElement('div');
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>',
            '</div>'
        ].join('');
        alertPlaceholder.append(wrapper);
    };

    // Manejador del evento de envío del formulario
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Detiene el envío real del formulario

        // Valida el formulario con Bootstrap
        if (!contactForm.checkValidity()) {
            event.stopPropagation();
            contactForm.classList.add('was-validated'); // Muestra los errores de validación
            return; // No hagas nada más si no es válido
        }

        // Si es válido, preparamos el envío a Formspree
        const formData = new FormData(contactForm);
        
        // Mostramos un estado de "enviando" en el botón
        submitButton.disabled = true;
        submitButton.innerHTML = 'Enviando...';

        // Usamos fetch para enviar los datos a la URL del 'action' del formulario
        fetch(contactForm.action, {
            method: contactForm.method,
            body: formData,
            headers: {
                'Accept': 'application/json' // Le dice a Formspree que responda con JSON
            }
        })
        .then(response => {
            if (response.ok) {
                // Éxito: Servidor respondió bien
                appendAlert('¡Mensaje enviado con éxito! Pronto nos pondremos en contacto contigo.', 'success');
                contactForm.reset(); // Limpia el formulario
                contactForm.classList.remove('was-validated'); // Limpia los estilos de validación
            } else {
                // Error: El servidor respondió con un error
                response.json().then(data => {
                    let errorMessage = data.errors ? data.errors.map(err => err.message).join(', ') : 'Hubo un error al enviar el mensaje.';
                    appendAlert(errorMessage, 'danger');
                });
            }
        })
        .catch(error => {
            // Error de red
            console.error('Error de red:', error);
            appendAlert('No se pudo enviar el mensaje. Revisa tu conexión a internet.', 'danger');
        })
        .finally(() => {
            // Re-habilita el botón sin importar el resultado
            submitButton.disabled = false;
            submitButton.innerHTML = 'Enviar Mensaje';
        });
    });
});