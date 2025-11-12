// Login profesional sin romper estilos existentes
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const userInput = document.getElementById("usuario");
  const passInput = document.getElementById("password");
  const errUser = document.getElementById("err-usuario");
  const errPass = document.getElementById("err-pass");
  const alertBox = document.getElementById("login-alert");
  const toggleBtn = document.getElementById("togglePass");

  // Utilidades
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const phoneRx = /^\d{10}$/; // MX típico
  const passRx = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

  const showErr = (input, holder, msg) => {
    input.classList.add("is-invalid", "input-error");
    if (holder) { holder.textContent = msg; holder.style.display = "block"; }
  };
  const clearErr = (input, holder) => {
    input.classList.remove("is-invalid", "input-error");
    if (holder) { holder.textContent = ""; holder.style.display = "none"; }
  };
  const showAlert = (msg) => {
    alertBox.textContent = msg;
    alertBox.classList.remove("d-none");
  };
  const hideAlert = () => alertBox.classList.add("d-none");

  // Toggle ver/ocultar contraseña
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const visible = passInput.type === "text";
      passInput.type = visible ? "password" : "text";
      toggleBtn.textContent = visible ? "Ver" : "Ocultar";
      toggleBtn.setAttribute("aria-pressed", String(!visible));
      passInput.focus();
    });
  }

  // Limpiar errores al escribir
  [userInput, passInput].forEach(el => {
    el.addEventListener("input", () => {
      clearErr(el, el === userInput ? errUser : errPass);
      hideAlert();
    });
  });

  // Validación
  function validate() {
    let ok = true;

    const u = userInput.value.trim();
    const p = passInput.value.trim();

    // Usuario: email válido o teléfono 10 dígitos
    if (!(emailRx.test(u) || phoneRx.test(u))) {
      ok = false;
      showErr(userInput, errUser, "Ingresa un correo válido o un número de 10 dígitos.");
    }

    // Password: 8+ con letra y número
    if (!passRx.test(p)) {
      ok = false;
      showErr(passInput, errPass, "Mínimo 8 caracteres con al menos 1 letra y 1 número.");
    }

    return ok;
  }

  // Submit (Enter o botón)
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    hideAlert();

    if (!validate()) {
      showAlert("Revisa los datos marcados.");
      return;
    }

    // Simulación de login OK: persistimos sesión básica
    const perfil = { usuario: userInput.value.trim(), t: Date.now() };
    try { localStorage.setItem("wbf_user", JSON.stringify(perfil)); } catch {}

    // Redirección a cuenta
    window.location.href = "./micuenta.html";
  });

  // ------- (opcional) soporte para imágenes por etapas -------
  const huskyImg = document.getElementById("husky-img");
  const huskyImages = {
    registro: "../assets/imagenes/perritos-varios/Huscky1.png",
    validacion: "../assets/imagenes/perritos-varios/Huscky2.png",
    exito: "../assets/imagenes/perritos-varios/Huscky3.png",
  };

  // Un pequeño guiño visual al validar
  form.addEventListener("submit", () => {
    if (huskyImg) {
      huskyImg.style.opacity = 0.2;
      setTimeout(() => {
        huskyImg.src = huskyImages.exito || huskyImg.src;
        huskyImg.style.opacity = 1;
      }, 250);
    }
  });
});

// ====== Login pro: alerta global + recuperar contraseña ======
(() => {
  const form = document.getElementById("loginForm");
  const usuario = document.getElementById("usuario");
  const pass = document.getElementById("password");
  const alertTop = document.getElementById("login-global");

  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const phoneRx = /^\d{10}$/;

  function showTop(msg){
    if(!alertTop) return;
    alertTop.textContent = msg || "Por favor verifique su correo o contraseña.";
    alertTop.classList.remove("d-none");
  }
  function hideTop(){ alertTop && alertTop.classList.add("d-none"); }

  if(form && usuario && pass){
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      hideTop();

      const u = (usuario.value || "").trim();
      const p = (pass.value || "").trim();

      const okUser = emailRx.test(u) || phoneRx.test(u);
      const okPass = p.length >= 5; // login no impone fuerza, solo mínima longitud

      if(!okUser || !okPass){ showTop(); return; }

      // Simulación de login OK → guardar sesión básica y redirigir
      try{ localStorage.setItem("wbf_user", JSON.stringify({u, t:Date.now()})); }catch(e){}
      window.location.href = "./micuenta.html";
    });
  }

  // --- Olvido de contraseña (modal + verificación simulada) ---
  const linkOlvido = document.getElementById("linkOlvido");
  const modalEl = document.getElementById("modalRecupera");
  const fpTarget = document.getElementById("fpTarget");
  const fpCode = document.getElementById("fpCode");
  const fpNewPass = document.getElementById("fpNewPass");
  const fpNewPass2 = document.getElementById("fpNewPass2");
  const btnSend = document.getElementById("btnSendCode");
  const btnReset = document.getElementById("btnResetPass");
  const fpAlert = document.getElementById("fpAlert");
  let code = null, target = null;

  const passStrongRx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{5,}$/;

  function msg(el, text, type="info"){
    if(!el) return;
    el.className = `alert alert-${type}`;
    el.textContent = text;
    el.classList.remove("d-none");
  }

  if(linkOlvido && modalEl){
    const modal = new bootstrap.Modal(modalEl);

    linkOlvido.addEventListener("click", (e)=>{ e.preventDefault(); fpAlert && fpAlert.classList.add("d-none"); modal.show(); });

    btnSend?.addEventListener("click", ()=>{
      const v = (fpTarget.value || "").trim();
      if(!(emailRx.test(v) || phoneRx.test(v))){ msg(fpAlert, "Escribe un correo válido o número de 10 dígitos.", "warning"); return; }
      target = v;
      code = String(Math.floor(100000 + Math.random()*900000));
      try{ sessionStorage.setItem("wbf_reset", JSON.stringify({target, code, t:Date.now()})); }catch(e){}
      msg(fpAlert, `Código enviado a ${target}. (demo: ${code})`, "success");
    });

    btnReset?.addEventListener("click", ()=>{
      if(!code){ msg(fpAlert, "Primero solicita el código.", "warning"); return; }
      if((fpCode.value || "").trim() !== code){ msg(fpAlert, "Código incorrecto.", "danger"); return; }
      const p1 = (fpNewPass.value || "").trim();
      const p2 = (fpNewPass2.value || "").trim();
      if(!passStrongRx.test(p1)){ msg(fpAlert, "Contraseña débil: mínimo 5 y debe incluir mayúscula, minúscula, número y carácter especial.", "warning"); return; }
      if(p1 !== p2){ msg(fpAlert, "Las contraseñas no coinciden.", "danger"); return; }

      // actualizar "base" local si existe
      try{
        const list = JSON.parse(localStorage.getItem("wbf_users") || "[]");
        const idx = list.findIndex(x => (x.email===target || x.telefono===target));
        if(idx >= 0){ list[idx].password = p1; localStorage.setItem("wbf_users", JSON.stringify(list)); }
      }catch(e){}
      msg(fpAlert, "Contraseña actualizada. Ahora puedes iniciar sesión.", "success");
      setTimeout(()=> modal.hide(), 900);
    });
  }
})();

