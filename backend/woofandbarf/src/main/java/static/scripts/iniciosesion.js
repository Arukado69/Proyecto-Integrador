document.addEventListener("DOMContentLoaded", () => {
//ver u ocultar password en formulario
  const toggleBtn = document.getElementById("togglePass");
  const passInput = document.getElementById("password");

  if (toggleBtn && passInput) {
    toggleBtn.addEventListener("click", () => {
      // Si es password lo volvemos text, y viceversa
      const isPassword = passInput.type === "password";
      passInput.type = isPassword ? "text" : "password";
      toggleBtn.textContent = isPassword ? "Ocultar" : "Ver";
    });
  }


  /* =========================================
     2. LÓGICA DE LOGIN (Conexión al Backend)
     ========================================= */

     //se extrae el id del boton de login
  const btnLogin = document.getElementById("loginSubmit");

  if (btnLogin) {
    btnLogin.addEventListener("click", (e) => {
      e.preventDefault(); // Evitar que el formulario recargue la página

      // 1. Obtener datos del HTML
      const correoInput = document.getElementById("usuario").value.trim();
      const passwordInput = document.getElementById("password").value.trim();
      const errorMsg = document.getElementById("err-pass"); // Usaremos este espacio para errores

      // Validación básica visual
      if (!correoInput || !passwordInput) {
        alert("Por favor ingresa tu correo y contraseña.");
        return;
      }

      //2. Creando objeto que interactua con el backend
      const loginRequest = {
        email: correoInput,
        password: passwordInput
      };

      // 3. Fetch al Backend
      const url = "http://localhost:8080/api/v1/auth/login";

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginRequest)
      })
      .then(response => {
        // Si el backend responde con error (ej. 403 o 500) es que la contraseña está mal
        if (!response.ok) {
           throw new Error("Credenciales inválidas");
        }
        return response.json();
      })
      .then(usuarioBackend => {
        // 4. ÉXITO: El usuario existe y la contraseña es correcta
        console.log("Login exitoso:", usuarioBackend);

        // 1. Guardar la sesión en el navegador (LocalStorage)
        // Esto sirve para que en las otras páginas sepas quién está conectado
        const usuarioSesion = {
            id: usuarioBackend.idUsuario,
            nombre: usuarioBackend.nombre,
            email: usuarioBackend.email,
            rol: usuarioBackend.rol
        };
        
        localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioSesion));

        // 2. Redirigir a la página principal o perfil
        alert(`¡Bienvenido de nuevo, ${usuarioBackend.nombre}!`);
        window.location.href = "../index.html"; 
      })
      .catch(error => {
        console.error("Error de login:", error);
        alert("Correo o contraseña incorrectos. Inténtalo de nuevo.");
      });

    });
  }

});
