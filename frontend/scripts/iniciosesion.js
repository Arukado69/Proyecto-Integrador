document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".tab-btn");
  const sections = document.querySelectorAll(".tabs-content section");
  const nextButtons = document.querySelectorAll(".btn-next");
  const huskyImg = document.getElementById("husky-img");

  // Mapeo de imágenes
const huskyImages = {
  registro: "../assets/imagenes/perritos-varios/Huscky1.png",
  validacion: "../assets/imagenes/perritos-varios/Huscky2.png",
  exito: "../assets/imagenes/perritos-varios/Huscky3.png",
};
  // Función de cambio de pestaña
  function activateTab(tabId) {
    // Actualizar pestañas activas
    buttons.forEach((b) => {
      const isActive = b.getAttribute("data-tab") === tabId;
      b.setAttribute("data-active", isActive);
    });

    // Mostrar la sección activa
    sections.forEach((s) =>
      s.setAttribute("data-active", s.id === tabId)
    );

    // Cambiar imagen con transición
    if (huskyImages[tabId]) {
      huskyImg.style.opacity = 0;
      setTimeout(() => {
        huskyImg.src = huskyImages[tabId];
        huskyImg.style.opacity = 1;
      }, 300);
    }
  }

  // Al hacer clic en las pestañas superiores
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.getAttribute("data-tab");
      activateTab(tab);
    });
  });

  // Al hacer clic en los botones "Siguiente" o "Validar"
  nextButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = btn.getAttribute("data-next");
      activateTab(next);
    });
  });
});


// Detectar botón "Siguiente" del login
const loginButton = document.querySelector("#login .btn-next");

if (loginButton) {
  loginButton.addEventListener("click", () => {
    const user = document.querySelector("#login input[type='text']");
    const pass = document.querySelector("#login input[type='password']");

    // Quitar errores anteriores
    user.classList.remove("input-error");
    pass.classList.remove("input-error");

    let valid = true;

    // Validar campos vacíos
    if (user.value.trim() === "") {
      user.classList.add("input-error");
      valid = false;
    }

    if (pass.value.trim() === "") {
      pass.classList.add("input-error");
      valid = false;
    }

    // Si todo está correcto, redirigir
    if (valid) {
      window.location.href = "home.html"; // Puedes cambiar el destino
    }
  });
}



