


// Botones de navegación
    document.addEventListener("DOMContentLoaded", function() {
        // Busca el contenedor de navegación
        const nav = document.querySelector(".article-navigation");
        
        // Si lo encuentra, le aplica los estilos de Bootstrap a la fuerza
        if (nav) {
            nav.style.display = "flex";
            nav.style.justifyContent = "space-between";
            console.log("Estilos de navegación forzados por JS.");
        }
    });
