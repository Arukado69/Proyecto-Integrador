// registro.js
// Lógica unificada: tabs + validación + guardado + requisitos + ver/ocultar
document.addEventListener("DOMContentLoaded", () => {
  /* -------------------------
     1) SELECTORES & CONFIG
     ------------------------- */
  const tabButtons = document.querySelectorAll(".tab-btn");
  const sections = document.querySelectorAll(".tabs-content section");
  const nextButtons = document.querySelectorAll(".btn-next");
  const huskyImg = document.getElementById("husky-img");
  const alertContainer = document.getElementById("alertContainer");

  // Inputs del formulario
  const inputNombre = document.getElementById("nombre");
  const inputApellido = document.getElementById("apellido");
  const inputCorreo = document.getElementById("correo") || document.getElementById("email"); // por si lo nombras distinto
  const inputNumero = document.getElementById("numero");
  const inputFecha = document.getElementById("fecha");
  const inputPassword = document.getElementById("password");
  const inputConfirm = document.getElementById("confirmar");

  // Elementos de requisitos (cada uno en su columna)
  const reqList = document.getElementById("password-requirements");
  const confirmReq = document.getElementById("confirm-requirements");

  // Imágenes por pestaña (si las usas)
  const huskyImages = {
    registro: "../assets/imagenes/perritos-varios/Huscky1.png",
    validacion: "../assets/imagenes/perritos-varios/Huscky2.png",
    exito: "../assets/imagenes/perritos-varios/Huscky3.png",
  };

  /* -------------------------
     2) UTIL: mostrar / limpiar alertas
     ------------------------- */
  function showAlert(type = "warning", message = "") {
    if (!alertContainer) return;
    alertContainer.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;
  }
  function clearAlert() {
    if (!alertContainer) return;
    alertContainer.innerHTML = "";
  }

  /* -------------------------
     3) TABS (activar sección)
     ------------------------- */
  function activateTab(tabId) {
    tabButtons.forEach(b => b.setAttribute("data-active", b.getAttribute("data-tab") === tabId));
    sections.forEach(s => s.setAttribute("data-active", s.id === tabId));
    // cambiar imagen si aplica
    if (huskyImg && huskyImages[tabId]) {
      huskyImg.style.opacity = 0;
      setTimeout(() => {
        huskyImg.src = huskyImages[tabId];
        huskyImg.style.opacity = 1;
      }, 250);
    }
  }
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const t = btn.getAttribute("data-tab");
      activateTab(t);
    });
  });

  /* -------------------------
     4) VALIDACIONES (antes de pasar a siguiente)
     ------------------------- */
  const nameRx = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]{2,}$/;
  const phoneRx10 = /^\d{10}$/;
  const passStrongRx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{5,}$/;
  function telefonoValido(v) {
    if (!phoneRx10.test(v)) return false;
    if (/^(\d)\1{9}$/.test(v)) return false;
    return true;
  }

  // Manejo del click en botones "Siguiente" (validation + guardado)
  nextButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      // si estamos en la pestaña 'registro' validar y guardar
      const parentSection = btn.closest("section");
      const isRegistro = parentSection && parentSection.id === "registro";
      const nextTab = btn.getAttribute("data-next");

      if (!isRegistro) {
        activateTab(nextTab);
        return;
      }

      // recoger valores
      const n = (inputNombre?.value || "").trim();
      const a = (inputApellido?.value || "").trim();
      const c = (inputCorreo?.value || "").trim();
      const tel = (inputNumero?.value || "").trim();
      const f = (inputFecha?.value || "").trim();
      const p1 = (inputPassword?.value || "").trim();
      const p2 = (inputConfirm?.value || "").trim();

      const errors = [];
      if (!nameRx.test(n)) errors.push("Nombre inválido (solo letras, mínimo 2).");
      if (!nameRx.test(a)) errors.push("Apellido inválido (solo letras, mínimo 2).");
      if (!telefonoValido(tel)) errors.push("Número inválido: usa 10 dígitos reales de MX.");
      if (!f) errors.push("La fecha es obligatoria.");
      if (!passStrongRx.test(p1)) errors.push("Contraseña débil: mínimo 5 y debe incluir mayúscula, minúscula, número y caracter especial.");
      if (p1 !== p2) errors.push("Las contraseñas no coinciden.");
      if (errors.length) {
        showAlert("warning", errors.join("<br>"));
        window.scrollTo({ top: parentSection.offsetTop - 50, behavior: "smooth" });
        return;
      }

      // guardar en localStorage (simulación backend)
      try {
        const list = JSON.parse(localStorage.getItem("wbf_users") || "[]");
        // evitar duplicados por teléfono
        if (list.some(u => u.telefono === tel)) {
          showAlert("warning", "Este número ya está registrado.");
          return;
        }
        list.push({ nombre: n, apellido: a, correo: c, telefono: tel, fecha: f, password: p1 });
        localStorage.setItem("wbf_users", JSON.stringify(list));
      } catch (err) {
        console.error("Error guardando usuario:", err);
      }

      clearAlert();
      activateTab(nextTab);
    });
  });

  /* -------------------------
     5) REQUISITOS DE CONTRASEÑA -> lista dinámica
     ------------------------- */
  // Si faltan data-rule en los li, los agregamos en orden (min, upper, lower, number, special)
  if (reqList) {
    const defaultRules = ["min", "upper", "lower", "number", "special"];
    const lis = Array.from(reqList.querySelectorAll("li"));
    lis.forEach((li, i) => {
      if (!li.dataset.rule) li.dataset.rule = defaultRules[i] || `rule-${i}`;
      li.classList.remove("valid", "invalid");
    });
  }

  // Confirm requirements: aseguramos que exista un li para match y le ponemos id
  if (confirmReq) {
    let li = confirmReq.querySelector("li");
    if (!li) {
      li = document.createElement("li");
      confirmReq.appendChild(li);
    }
    li.id = "match-rule";
    li.classList.remove("valid", "invalid");
    // texto por defecto (puedes personalizar)
    if (!li.textContent.trim()) li.textContent = "Las contraseñas deben coincidir";
  }

  // reglas de evaluación
  const rules = {
    min: v => v.length >= 5,
    upper: v => /[A-Z]/.test(v),
    lower: v => /[a-z]/.test(v),
    number: v => /\d/.test(v),
    special: v => /[^A-Za-z0-9]/.test(v)
  };

  // mostrar/ocultar la lista de requisitos SOLO en la columna de password
  if (inputPassword && reqList) {
    inputPassword.addEventListener("focus", () => reqList.style.display = "block");
    inputPassword.addEventListener("blur", () => {
      // no ocultar inmediatamente si el usuario está escribiendo en confirmar
      setTimeout(() => {
        // si el foco está dentro de reqList o en confirmar no ocultamos
        const active = document.activeElement;
        if (reqList.contains(active) || active === inputConfirm) return;
        reqList.style.display = "none";
      }, 100);
    });
  }

  // validar dinámico al tipear
  function updateReqList(val) {
    if (!reqList) return;
    const lis = Array.from(reqList.querySelectorAll("li"));
    lis.forEach(li => {
      const r = li.dataset.rule;
      const ok = typeof rules[r] === "function" ? rules[r](val) : false;
      li.classList.toggle("valid", ok);
      li.classList.toggle("invalid", !ok);
    });
  }

  // Actualizar coincidencia (columna confirmar)
  function updateMatch() {
    const matchLi = document.getElementById("match-rule");
    if (!matchLi) return;
    const ok = inputPassword.value !== "" && inputPassword.value === inputConfirm.value;
    matchLi.classList.toggle("valid", ok);
    matchLi.classList.toggle("invalid", !ok);
    // mostramos u ocultamos el bloque de confirmación según foco/valor
    if (inputConfirm === document.activeElement || inputConfirm.value) {
      confirmReq.classList.remove("d-none");
    } else {
      confirmReq.classList.add("d-none");
    }
  }

  // listeners input
  if (inputPassword) {
    inputPassword.addEventListener("input", (e) => {
      updateReqList(e.target.value);
      updateMatch();
    });
  }
  if (inputConfirm) {
    inputConfirm.addEventListener("input", updateMatch);
    inputConfirm.addEventListener("focus", () => confirmReq.classList.remove("d-none"));
    inputConfirm.addEventListener("blur", () => {
      setTimeout(() => {
        const active = document.activeElement;
        if (confirmReq.contains(active) || active === inputPassword) return;
        if (!inputConfirm.value) confirmReq.classList.add("d-none");
      }, 100);
    });
  }

  // Inicialmente ocultamos confirmReq hasta que se use el confirmar
  if (confirmReq) confirmReq.classList.add("d-none");

  /* -------------------------
     6) TOGGLE Ver / Ocultar para ambos campos
     ------------------------- */
  // Requerimos que tus botones tengan data-target="password" o "confirmar"
  document.querySelectorAll(".toggle-password").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      if (!targetId) return;
      const input = document.getElementById(targetId);
      if (!input) return;
      const showing = input.type === "text";
      input.type = showing ? "password" : "text";
      btn.textContent = showing ? "Ver" : "Ocultar";
      input.focus();
    });
  });

  /* -------------------------
     7) Accessibilidades / limpieza
     ------------------------- */
  // Evitar submit en el form si no quieres recargar (si usas <form> con submit)
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
    });
  }

  // pequeña mejora: cerrar alert al escribir
  [inputNombre, inputApellido, inputNumero, inputFecha, inputPassword, inputConfirm].forEach(inp => {
    if (!inp) return;
    inp.addEventListener("input", () => clearAlert());
  });

  /* -------------------------
     8) FIN - inicializar estado
     ------------------------- */
  // esconder listas al iniciar
  if (reqList) reqList.style.display = "none";
  if (confirmReq) confirmReq.classList.add("d-none");

  // si quieres forzar una pestaña al cargar:
  activateTab("registro");
});
