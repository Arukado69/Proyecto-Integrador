// registro.js
// Lógica unificada: tabs + validación + requisitos + ver/ocultar + POST al backend
document.addEventListener("DOMContentLoaded", () => {

  /* -------------------------
     1) SELECTORES & CONFIG
     ------------------------- */
  const tabButtons = document.querySelectorAll(".tab-btn");
  const sections = document.querySelectorAll(".tabs-content section");
  const huskyImg = document.getElementById("husky-img");
  const alertContainer = document.getElementById("alertContainer");

  // Inputs del formulario
  const inputNombre = document.getElementById("nombre");
  const inputApellido = document.getElementById("apellido");
  const inputCorreo = document.getElementById("correo") || document.getElementById("email");
  const inputNumero = document.getElementById("numero");
  const inputFecha = document.getElementById("fecha");
  const inputPassword = document.getElementById("password");
  const inputConfirm = document.getElementById("confirmar");

  // Requisitos
  const reqList = document.getElementById("password-requirements");
  const confirmReq = document.getElementById("confirm-requirements");

  const huskyImages = {
    registro: "../assets/imagenes/perritos-varios/Huscky1.png",
    exito: "../assets/imagenes/perritos-varios/Huscky3.png",
  };

  /* -------------------------
     2) ALERTAS
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
     3) TABS
     ------------------------- */
  function activateTab(tabId) {
    tabButtons.forEach(b => b.setAttribute("data-active", b.getAttribute("data-tab") === tabId));
    sections.forEach(s => s.setAttribute("data-active", s.id === tabId));

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
     4) VALIDACIONES
     ------------------------- */
  const nameRx = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]{2,}$/;
  const phoneRx10 = /^\d{10}$/;
  const passStrongRx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{5,}$/;

  function telefonoValido(v) {
    if (!phoneRx10.test(v)) return false;
    if (/^(\d)\1{9}$/.test(v)) return false;
    return true;
  }

  /* -------------------------
     5) REQUISITOS DE CONTRASEÑA
     ------------------------- */
  if (reqList) {
    const defaultRules = ["min", "upper", "lower", "number", "special"];
    const lis = Array.from(reqList.querySelectorAll("li"));
    lis.forEach((li, i) => {
      if (!li.dataset.rule) li.dataset.rule = defaultRules[i] || `rule-${i}`;
      li.classList.remove("valid", "invalid");
    });
  }

  if (confirmReq) {
    let li = confirmReq.querySelector("li");
    if (!li) {
      li = document.createElement("li");
      confirmReq.appendChild(li);
    }
    li.id = "match-rule";
    li.textContent = "Las contraseñas deben coincidir";
  }

  const rules = {
    min: v => v.length >= 5,
    upper: v => /[A-Z]/.test(v),
    lower: v => /[a-z]/.test(v),
    number: v => /\d/.test(v),
    special: v => /[^A-Za-z0-9]/.test(v)
  };

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

  function updateMatch() {
    const matchLi = document.getElementById("match-rule");
    if (!matchLi) return;
    const ok = inputPassword.value !== "" && inputPassword.value === inputConfirm.value;
    matchLi.classList.toggle("valid", ok);
    matchLi.classList.toggle("invalid", !ok);
    if (inputConfirm === document.activeElement || inputConfirm.value) {
      confirmReq.classList.remove("d-none");
    } else {
      confirmReq.classList.add("d-none");
    }
  }

  if (inputPassword) {
    inputPassword.addEventListener("input", (e) => {
      updateReqList(e.target.value);
      updateMatch();
    });
  }
  if (inputConfirm) {
    inputConfirm.addEventListener("input", updateMatch);
  }

  if (confirmReq) confirmReq.classList.add("d-none");
  if (reqList) reqList.style.display = "none";

  /* -------------------------
     6) TOGGLE PASSWORD
     ------------------------- */
  document.querySelectorAll(".toggle-password").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.target;
      const input = document.getElementById(id);
      if (!input) return;

      const showing = input.type === "text";
      input.type = showing ? "password" : "text";
      btn.textContent = showing ? "Ver" : "Ocultar";
      input.focus();
    });
  });

  /* -------------------------
     7) REGISTRO → POST AL BACKEND
     ------------------------- */
  const btnRegistro = document.getElementById("btnRegistro");

  if (btnRegistro) {
    btnRegistro.addEventListener("click", async () => {
      const n = (inputNombre?.value || "").trim();
      const a = (inputApellido?.value || "").trim();
      const c = (inputCorreo?.value || "").trim();
      const tel = (inputNumero?.value || "").trim();
      const f = (inputFecha?.value || "").trim();
      const p1 = (inputPassword?.value || "").trim();
      const p2 = (inputConfirm?.value || "").trim();

      const errores = [];
      if (!nameRx.test(n)) errores.push("Nombre inválido.");
      if (!nameRx.test(a)) errores.push("Apellido inválido.");
      if (!c) errores.push("Correo obligatorio.");
      if (!telefonoValido(tel)) errores.push("Número inválido.");
      if (!f) errores.push("La fecha es obligatoria.");
      if (!passStrongRx.test(p1)) errores.push("La contraseña no cumple los requisitos.");
      if (p1 !== p2) errores.push("Las contraseñas no coinciden.");

      if (errores.length) {
        showAlert("warning", errores.join("<br>"));
        return;
      }

      try {
        const resp = await fetch("http://localhost:8080/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: n,
            apellido: a,
            correo: c,
            telefono: tel,
            fechaNacimiento: f,
            password: p1
          })
        });

        if (!resp.ok) {
          showAlert("danger", "Hubo un error al registrar el usuario.");
          return;
        }

        clearAlert();
        activateTab("exito");

      } catch (err) {
        console.error(err);
        showAlert("danger", "Error de conexión al servidor.");
      }
    });
  }

  /* -------------------------
     8) INICIALIZAR
     ------------------------- */
  activateTab("registro");

});
