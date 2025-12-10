document.addEventListener("DOMContentLoaded", function() {
    
    // Selecciona todos los enlaces de pestaña y todos los paneles de contenido
    const tabLinks = document.querySelectorAll(".tab-link");
    const tabPanes = document.querySelectorAll(".tab-pane");

    // Agrega un 'click listener' a cada enlace de pestaña
    tabLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault(); // Evita que el enlace (href="#") recargue la página

            // Obtiene el ID del contenido que este enlace debe mostrar
            const targetId = this.getAttribute("data-target");

            // 1. Desactivar todas las pestañas y paneles
            tabLinks.forEach(link => {
                link.classList.remove("active");
            });

            tabPanes.forEach(pane => {
                pane.classList.remove("active");
            });

            // 2. Activar la pestaña clickeada y el panel correspondiente
            this.classList.add("active");
            document.querySelector(targetId).classList.add("active");
        });
    });
});