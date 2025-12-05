// Cambiar foto
const inputFoto = document.getElementById("inputFoto");
const btnCambiarFoto = document.getElementById("btnCambiarFoto");
const profileImage = document.getElementById("profileImage");

// Abre selector de archivo
btnCambiarFoto.addEventListener("click", () => {
    inputFoto.click();
});

// Cambia visualmente la foto
inputFoto.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        profileImage.src = URL.createObjectURL(file);
    }
});

// Editar info (modal o formulario)
document.getElementById("btnEditar").addEventListener("click", () => {
    alert("Aquí abrirías un formulario para editar los datos.");
});

// Cerrar sesión
document.getElementById("btnCerrarSesion").addEventListener("click", () => {
    alert("Cerrar sesión. Aquí llamarías a tu endpoint de Spring Boot.");
});

