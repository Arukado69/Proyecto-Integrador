document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     1. CONFIGURACIÓN VISUAL (Tabs y Husky)
     ========================================= */
  const tabButtons = document.querySelectorAll(".tab-btn");
  const sections = document.querySelectorAll(".tabs-content section");
  const huskyImg = document.getElementById("husky-img");

  const huskyImages = {
    registro: "../assets/imagenes/perritos-varios/Huscky1.png",
    exito: "../assets/imagenes/perritos-varios/Huscky3.png",
  };

  // Función para cambiar de pestaña e imagen
  function activateTab(tabId) {
    // 1. Activar botones y secciones visualmente
    tabButtons.forEach(b => b.setAttribute("data-active", b.getAttribute("data-tab") === tabId));
    sections.forEach(s => s.setAttribute("data-active", s.id === tabId));

    // 2. Animación del perrito
    if (huskyImg && huskyImages[tabId]) {
      huskyImg.style.opacity = 0;
      setTimeout(() => {
        huskyImg.src = huskyImages[tabId];
        huskyImg.style.opacity = 1;
      }, 250);
    }
  }

  // Inicializar en la pestaña de registro
  activateTab("registro");


  /* =========================================
     2. LÓGICA DE VALIDACIÓN Y ENVÍO
     ========================================= */
  const btnRegistro = document.getElementById("btnRegistro");

  // Expresiones regulares para validar (Conservadas del script original)
  const nameRx = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]{2,}$/;
  const phoneRx10 = /^\d{10}$/;
  // Mínimo 5 chars, 1 mayúscula, 1 minúscula, 1 número (Simplificada para que no de tantos problemas)
  const passStrongRx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{5,}$/; 

  if (btnRegistro) {
    btnRegistro.addEventListener("click", (e) => {
      e.preventDefault(); // Evita recarga de página

      // A) Obtener valores (Corregido el ID de apellido)
      const nombreInput = document.getElementById("nombre").value.trim();
      const apellidoInput = document.getElementById("apellidos").value; // ID corregido a singular
      const correoInput = document.getElementById("correo").value.trim();
      const telefonoInput = document.getElementById("numero").value.trim();
      const passwordInput = document.getElementById("password").value.trim();
      const fechaInput = document.getElementById("fecha").value;
      const confirmInput = document.getElementById("confirmar").value.trim();

      
      // La fecha la ignoramos por ahora hasta que actualices el Java
      // const fechaInput = document.getElementById("fecha").value;

      // B) Validaciones del Formulario
      const errores = [];

      if (!nameRx.test(nombreInput)) errores.push("El nombre no es válido.");
      if (!nameRx.test(apellidoInput)) errores.push("El apellido no es válido.");
      if (!correoInput.includes("@")) errores.push("Correo inválido.");
      if (!phoneRx10.test(telefonoInput)) errores.push("El teléfono debe ser de 10 dígitos.");
      if (!passStrongRx.test(passwordInput)) errores.push("La contraseña debe tener mayúscula, minúscula y número.");
      if (passwordInput !== confirmInput) errores.push("Las contraseñas no coinciden.");

      // Si hay errores, mostramos alerta y detenemos
      if (errores.length > 0) {
        alert("Errores:\n" + errores.join("\n"));
        return;
      }

      // C) Objeto JSON para el Backend
      const usuario = {
        nombre: nombreInput,
        apellidos: apellidoInput, // Java espera 'apellidos'
        email: correoInput,       // Java espera 'email'
        telefono: telefonoInput,  // Java espera 'telefono'
        password: passwordInput,
        fechaNacimiento: fechaInput,

      };

      // D) Conexión Fetch (Tu lógica)
      const url = "http://52.15.203.222:8080/api/v1/auth/register";

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(usuario)
      })
      .then(response => {
        if (!response.ok) {
           throw new Error("Error en el servidor o datos duplicados");
        }
        return response.json();
      })
      .then(data => {
        console.log("Guardado", data);
        
        // E) AQUÍ LA MAGIA: Cambiamos al template de éxito (Husky feliz)
        activateTab("exito"); 
        
        // Opcional: Limpiar formulario
        document.querySelector("form").reset();
      })
      .catch(error => {
        console.error(error);
        alert("Hubo un error al registrar. Revisa que el correo no esté repetido.");
      });

    });
  }

  /* =========================================
     3. EXTRAS VISUALES (Ver/Ocultar Password)
     ========================================= */
  document.querySelectorAll(".toggle-password").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.target;
      const input = document.getElementById(id);
      if (input) {
        input.type = input.type === "text" ? "password" : "text";
        btn.textContent = input.type === "text" ? "Ocultar" : "Ver";
      }
    });
  });

});