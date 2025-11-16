// Scroll Blog inicio
document.addEventListener("DOMContentLoaded", () => {
    
    // Configura el "observador"
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Si el elemento (el título) está ahora en la pantalla...
            if (entry.isIntersecting) {
                // ...añade la clase 'is-visible' para activar la animación
                entry.target.classList.add("is-visible");
                
                // (Opcional) Deja de observar este elemento
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Dispara cuando el 10% del elemento sea visible
    });

    // Busca todos los elementos que quieras animar
    const elementsToAnimate = document.querySelectorAll(".animate-on-scroll");
    
    // Dile al observador que "vigile" cada uno de esos elementos
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });

});