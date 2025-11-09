document.addEventListener("DOMContentLoaded", () => {
  // --- 1. SELECTORES ---
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

  // --- 2. FUNCIÓN DE ALERTA ---
  function mostrarAlerta(tipo, mensaje) {
    // Busca el contenedor de alertas DENTRO de la pestaña activa
    const alertContainer = document.querySelector("#registro #alertContainer");
    if (alertContainer) {
      alertContainer.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
          ${mensaje}
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
      `;
    }
  }

  // --- 3. FUNCIÓN PARA CAMBIAR PESTAÑA E IMAGEN ---
  function activateTab(tabId) {
    // Actualizar botones activos
    buttons.forEach((b) => {
      const isActive = b.getAttribute("data-tab") === tabId;
      b.setAttribute("data-active", isActive);
    });

    // Mostrar sección activa
    sections.forEach((s) =>
      s.setAttribute("data-active", s.id === tabId)
    );

    // Cambiar imagen con transición
    if (huskyImages[tabId] && huskyImg) {
      huskyImg.style.opacity = 0;
      setTimeout(() => {
        huskyImg.src = huskyImages[tabId];
        huskyImg.style.opacity = 1;
      }, 300); // 300ms de transición
    }
  }

  // --- 4. CLICS EN BOTONES SUPERIORES (Tabs) ---
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.getAttribute("data-tab");
      activateTab(tab);
    });
  });

  // --- 5. CLICS EN BOTONES "SIGUIENTE" (Aquí está la fusión) ---
  nextButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      
      const nextTabId = btn.getAttribute("data-next");
      
      // Verificamos si el botón está DENTRO de la pestaña "registro"
      const esBotonRegistro = btn.closest("section").id === "registro";

      if (esBotonRegistro) {
        // --- INICIO DE LÓGICA DE GUARDADO (Pestaña 1) ---
        
        // a. Obtenemos valores
        const nombre = document.getElementById("nombre").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        const numero = document.getElementById("numero").value.trim();
        const fecha = document.getElementById("fecha").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmar = document.getElementById("confirmar").value.trim();

        // b. Validaciones
        if (!nombre || !apellido || !numero || !fecha || !password || !confirmar) {
          mostrarAlerta("danger", "Todos los campos son obligatorios.");
          return; // Detiene todo, no avanza de pestaña
        }
        
        const telefonoRegex = /^[0-9]{10}$/; 
        if (!telefonoRegex.test(numero)) {
          mostrarAlerta("danger", "El número de teléfono debe tener 10 dígitos.");
          return; // Detiene todo
        }
        
        if (password !== confirmar) {
          mostrarAlerta("danger", "Las contraseñas no coinciden.");
          return; // Detiene todo
        }

        // c. Crear objeto
        const usuario = {
          nombreCompleto: `${nombre} ${apellido}`,
          telefono: numero,
          fechaNacimiento: fecha,
          password: password
        };

        // d. Guardar en localStorage
        const usuariosGuardados = localStorage.getItem("usuariosRegistrados");
        let listaUsuarios = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];

        // e. Validar duplicados
        const telefonoExiste = listaUsuarios.some(user => user.telefono === usuario.telefono);
        if (telefonoExiste) {
            mostrarAlerta("warning", "Este número de teléfono ya está registrado.");
            return; // Detiene todo
        }

        // f. Guardar y mostrar en consola
        listaUsuarios.push(usuario);
        localStorage.setItem("usuariosRegistrados", JSON.stringify(listaUsuarios));
        
        console.log("¡Usuario registrado! Lista actualizada:", listaUsuarios);
        
        // Limpiar alertas si todo salió bien
        const alertContainer = document.getElementById('alertContainer');
        if (alertContainer) alertContainer.innerHTML = "";
        
        // g. ¡ÉXITO! Ahora sí, avanzamos a la siguiente pestaña
        activateTab(nextTabId);

        // --- FIN DE LÓGICA DE GUARDADO ---
      
      } else {
        // Para cualquier otro botón "Siguiente" (como el de "Validar")
        // solo cambiamos de pestaña, sin guardar nada.
        activateTab(nextTabId);
      }
    });
  });
});

// ====== Registro pro: validaciones fuertes y guardado local ======
(() => {
  const nombre = document.getElementById("nombre");
  const apellido = document.getElementById("apellido");
  const numero = document.getElementById("numero");
  const fecha = document.getElementById("fecha");
  const pass = document.getElementById("password");
  const confirmar = document.getElementById("confirmar");

  const passStrongRx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{5,}$/;
  const nameRx = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]{2,}$/;
  const phoneRx10 = /^\d{10}$/;

  function telefonoValido(v){
    if(!phoneRx10.test(v)) return false;
    if(/^(\d)\1{9}$/.test(v)) return false; // 0000000000, 1111111111
    if(["0123456789","1234567890","0987654321"].includes(v)) return false;
    return true;
  }

  // Hook sobre los botones "Siguiente" con captura para frenar la navegación de pestaña
  document.querySelectorAll(".btn-next").forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      // solo validamos cuando estamos en la pestaña de registro
      const inRegistro = btn.closest("#registro");
      if(!inRegistro) return;

      const n = (nombre?.value || "").trim();
      const a = (apellido?.value || "").trim();
      const tel = (numero?.value || "").trim();
      const f = (fecha?.value || "").trim();
      const p1 = (pass?.value || "").trim();
      const p2 = (confirmar?.value || "").trim();

      let errores = [];
      if(!nameRx.test(n)) errores.push("Nombre inválido (solo letras, mínimo 2).");
      if(!nameRx.test(a)) errores.push("Apellido inválido (solo letras, mínimo 2).");
      if(!telefonoValido(tel)) errores.push("Número inválido: usa 10 dígitos reales de MX.");
      if(!f) errores.push("La fecha es obligatoria.");
      if(!passStrongRx.test(p1)) errores.push("Contraseña débil: mínimo 5 y debe incluir mayúscula, minúscula, número y caracter especial.");
      if(p1 !== p2) errores.push("Las contraseñas no coinciden.");

      if(errores.length){
        // Usa tu contenedor de alertas existente si está
        const box = document.getElementById("alertContainer");
        if(box){ box.innerHTML = `<div class="alert alert-warning">${errores.join("<br>")}</div>`; }
        e.stopImmediatePropagation(); // frena el cambio de pestaña
        e.preventDefault();
        return;
      }

      // Guardar usuario en "BD" local
      try{
        const list = JSON.parse(localStorage.getItem("wbf_users") || "[]");
        list.push({ nombre:n, apellido:a, telefono:tel, fecha:f, password:p1 });
        localStorage.setItem("wbf_users", JSON.stringify(list));
      }catch(_){}

      // deja continuar a la pestaña de validación (tu handler original hará el cambio)
    }, true);
  });
})();
