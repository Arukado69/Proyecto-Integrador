// ======================================================================
// Carrito Futurista — Lógica con Bootstrap 5
// Requiere: HTML previo que compartiste + Bootstrap 5.3.8 bundle
// ======================================================================
(() => {
  "use strict";

  // --------- Utils ---------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const on = (el, ev, cb, opts) => el && el.addEventListener(ev, cb, opts);
  const money = (n) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(
      Number.isFinite(n) ? n : 0
    );
  const parsePrice = (txt) => {
    if (!txt) return 0;
    const m = String(txt).replaceAll(",", "").match(/(\d+(\.\d+)?)/);
    return m ? parseFloat(m[1]) : 0;
  };
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const debounce = (fn, ms = 250) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  };

  // --------- Estado (con persistencia) ---------
  const STORAGE_KEY = "wb-cart-v1";
  const loadState = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };
  const saveState = debounce((state) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, 200);

  // Estado en memoria
  const state = {
    items: [], // {id, price, qty}
    shippingIndex: 0,
    addresses: [], // [{id, text}]
    selectedAddress: 0,
    ...loadState(),
  };

  // --------- Inicialización desde el DOM ---------
  const productsRoot = $(".carrito-productos");
  const summaryRoot = $(".resumen-compra");
  const envioRoot = $(".metodo-entrega");
  const dirRoot = $(".direccion-entrega");
  const title = $(".titulo-pagina");

  // Crea un ID simple
  const uid = (pfx = "id") =>
    `${pfx}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-3)}`;

  // Lee items del DOM (si no hay en storage)
  const bootstrapItemsFromDOM = () =>
    $$(".producto-item", productsRoot).map((el, i) => {
      const qty = parseInt($(".input-cantidad", el)?.value || "1", 10) || 1;
      // Si el HTML no trae precio, ponemos uno base (lo puedes reemplazar luego)
      const fallback = 129.0 + i * 20;
      const price =
        parseFloat(el.dataset.precio) ||
        parseFloat(el.dataset.price) ||
        parsePrice($(".precio", el)?.textContent) ||
        fallback;
      return {
        id: el.dataset.id || uid("p"),
        price,
        qty,
        _el: el,
      };
    });

  if (!state.items?.length) {
    state.items = bootstrapItemsFromDOM().map(({ id, price, qty }) => ({ id, price, qty }));
    saveState(state);
  }

  // Sincroniza cantidades del DOM con el estado guardado (si existen nodos)
  const syncDOMQuantities = () => {
    const nodes = $$(".producto-item", productsRoot);
    nodes.forEach((el, idx) => {
      const id = el.dataset.id || (state.items[idx]?.id ?? uid("p"));
      el.dataset.id = id;
      const found = state.items.find((it) => it.id === id);
      const input = $(".input-cantidad", el);
      if (found && input) input.value = String(found.qty);
    });
  };
  syncDOMQuantities();

  // --------- UI helpers (Bootstrap) ---------
  // Tooltips
  const initTooltips = () => {
    $$("[data-bs-toggle='tooltip']").forEach((el) => new bootstrap.Tooltip(el));
  };

  // Toasts
  const toastContainer = (() => {
    let c = $("#toasts");
    if (!c) {
      c = document.createElement("div");
      c.id = "toasts";
      c.className = "toast-container position-fixed top-0 end-0 p-3";
      document.body.appendChild(c);
    }
    return c;
  })();
  const showToast = (titleTxt, bodyTxt, color = "primary") => {
    const wrap = document.createElement("div");
    wrap.className = `toast align-items-center text-bg-${color} border-0`;
    wrap.setAttribute("role", "alert");
    wrap.setAttribute("aria-live", "assertive");
    wrap.setAttribute("aria-atomic", "true");
    wrap.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          <strong>${titleTxt}</strong><div class="small opacity-75">${bodyTxt || ""}</div>
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>`;
    toastContainer.appendChild(wrap);
    const t = new bootstrap.Toast(wrap, { delay: 2000 });
    t.show();
  };

  // Badge dinámico (oculta el ::after del CSS y usa un <span>)
  const ensureBadge = () => {
    if (!title) return null;
    document.body.classList.add("js-badge");
    let styleEl = $("#_badge_override_style_");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "_badge_override_style_";
      styleEl.textContent = `.js-badge .titulo-pagina::after{content:'' !important;}`;
      document.head.appendChild(styleEl);
    }
    let b = $(".cart-badge", title);
    if (!b) {
      b = document.createElement("span");
      b.className = "cart-badge badge rounded-pill text-dark ms-2";
      b.style.background =
        "linear-gradient(90deg, var(--bs-success), var(--bs-info))";
      b.style.fontWeight = "800";
      b.style.boxShadow = "0 6px 12px rgba(46,242,162,.35)";
      title.appendChild(b);
    }
    return b;
  };
  const updateBadge = () => {
    const b = ensureBadge();
    if (!b) return;
    const totalQty = state.items.reduce((a, b) => a + (b.qty || 0), 0);
    b.textContent = `🛒 ${totalQty}`;
  };

  // --------- Cálculos ---------
  const getShipping = () => {
    // Lee radio seleccionado y su precio
    const radios = $$("input[type='radio']", envioRoot);
    const checked = radios.find((r) => r.checked) || radios[state.shippingIndex] || radios[0];
    const label = checked?.closest("label");
    const p = parsePrice($(".precio-opcion", label)?.textContent);
    const idx = radios.indexOf(checked);
    state.shippingIndex = idx < 0 ? 0 : idx;
    return p || 0;
  };

  const getIVA = (subtotal) => subtotal * 0.16;

  const recalc = () => {
    const subtotal = state.items.reduce((acc, it) => acc + it.price * it.qty, 0);
    const shipping = getShipping();
    const iva = getIVA(subtotal);
    const total = subtotal + iva + shipping;

    // Pintar en el resumen (asumiendo 4 <li>)
    const lis = $$(".lista-resumen li", summaryRoot);
    if (lis[0]) lis[0].innerHTML = `Subtotal: <span>${money(subtotal)}</span>`;
    if (lis[1]) lis[1].innerHTML = `Envío: <span>${money(shipping)}</span>`;
    if (lis[2]) lis[2].innerHTML = `IVA (16%): <span>${money(iva)}</span>`;
    if (lis[3]) lis[3].innerHTML = `Total: <strong>${money(total)}</strong>`;

    updateBadge();
    saveState(state);
  };

  // --------- Stepper (click y press & hold) ---------
  const attachStepper = (rowEl, item) => {
    const minus = $(".btn-restar", rowEl);
    const plus = $(".btn-sumar", rowEl);
    const input = $(".input-cantidad", rowEl);

    const setQty = (q) => {
      const newQty = clamp(q, 0, 99);
      item.qty = newQty;
      if (input) input.value = String(newQty);

      // Si llega a 0, pedir confirmación para quitar del carrito
      if (newQty === 0) {
        const ok = confirm("Cantidad 0. ¿Quieres quitar este producto del carrito?");
        if (ok) {
          // Eliminar del estado y del DOM
          state.items = state.items.filter((it) => it.id !== item.id);
          rowEl.remove();
          showToast("Producto eliminado", "Se quitó del carrito", "danger");
        } else {
          item.qty = 1;
          if (input) input.value = "1";
        }
      } else {
        // Micro-feedback
        rowEl.animate([{ transform: "scale(1)" }, { transform: "scale(1.02)" }, { transform: "scale(1)" }], { duration: 180 });
      }

      recalc();
    };

    const step = (delta) => setQty((item.qty || 1) + delta);

    // Click normal
    on(plus, "click", () => step(+1));
    on(minus, "click", () => step(-1));

    // Press & hold
    let holdTimer, tick;
    const startHold = (delta) => {
      step(delta);
      clearTimeout(holdTimer);
      clearInterval(tick);
      holdTimer = setTimeout(() => {
        tick = setInterval(() => step(delta), 80);
      }, 300);
    };
    const endHold = () => {
      clearTimeout(holdTimer);
      clearInterval(tick);
    };
    ["mousedown", "touchstart"].forEach((ev) => {
      on(plus, ev, (e) => {
        e.preventDefault();
        startHold(+1);
      });
      on(minus, ev, (e) => {
        e.preventDefault();
        startHold(-1);
      });
    });
    ["mouseup", "mouseleave", "touchend", "touchcancel"].forEach((ev) => {
      on(plus, ev, endHold);
      on(minus, ev, endHold);
    });

    // Edición manual (por si quitan readonly en la reestructura)
    on(input, "input", () => {
      const v = parseInt(input.value.replace(/\D/g, ""), 10);
      setQty(Number.isFinite(v) ? v : item.qty);
    });
  };

  // Vincular steppers actuales a estado (por posición/ID)
  const bindAllSteppers = () => {
    const nodes = $$(".producto-item", productsRoot);
    nodes.forEach((rowEl) => {
      const id = rowEl.dataset.id || uid("p");
      rowEl.dataset.id = id;

      // Busca/crea item en estado
      let item = state.items.find((it) => it.id === id);
      if (!item) {
        const qty = parseInt($(".input-cantidad", rowEl)?.value || "1", 10) || 1;
        const fallbackPrice = 129.0;
        const price =
          parseFloat(rowEl.dataset.precio) ||
          parseFloat(rowEl.dataset.price) ||
          parsePrice($(".precio", rowEl)?.textContent) ||
          fallbackPrice;
        item = { id, price, qty };
        state.items.push(item);
      }
      attachStepper(rowEl, item);
    });
  };
  bindAllSteppers();

  // Observa cambios en la lista (por si agregan/quitán artículos luego)
  const observer = new MutationObserver(() => {
    bindAllSteppers();
    recalc();
  });
  if (productsRoot) {
    observer.observe(productsRoot, { childList: true, subtree: true });
  }

  // --------- Envío ---------
  if (envioRoot) {
    on(envioRoot, "change", (e) => {
      if (e.target.matches("input[type='radio']")) {
        // Marcar visualmente
        $$(".opcion-entrega", envioRoot).forEach((lab) => lab.classList.remove("active"));
        e.target.closest("label")?.classList.add("active");
        recalc();
        showToast("Método de envío actualizado", "Se recalculó el total", "info");
      }
    });
  }

  // --------- Dirección (modal "Agregar otra") ---------
  const ensureAddressModal = () => {
    let m = $("#direccionModal");
    if (m) return m;
    const markup = `
      <div class="modal fade" id="direccionModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content bg-dark text-light border border-info">
            <div class="modal-header">
              <h5 class="modal-title">Agregar dirección</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body">
              <form id="direccionForm" class="row g-3">
                <div class="col-12">
                  <label class="form-label">Alias / Identificador</label>
                  <input class="form-control" name="alias" placeholder="Casa, Trabajo..." required>
                </div>
                <div class="col-12">
                  <label class="form-label">Dirección</label>
                  <textarea class="form-control" name="full" rows="3" placeholder="Calle, número, colonia, alcaldía, CP" required></textarea>
                </div>
              </form>
              <div class="small opacity-75 mt-2">Se guardará localmente en tu navegador.</div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-outline-light" data-bs-dismiss="modal">Cancelar</button>
              <button id="guardarDireccion" class="btn btn-info">Guardar</button>
            </div>
          </div>
        </div>
      </div>`;
    document.body.insertAdjacentHTML("beforeend", markup);
    return $("#direccionModal");
  };

  const renderAddresses = () => {
    // Crea radios dentro de .direccion-entrega
    const cont = $(".direccion-info", dirRoot);
    if (!cont) return;

    // El primer radio ya existe en el HTML; lo convertimos en lista dinámica
    // Limpia y vuelve a renderizar (conservando el primero si no hay data)
    const wrapper = cont.parentElement;
    // Elimina todos los .direccion-info menos el primero
    $$(".direccion-info", wrapper)
      .slice(1)
      .forEach((n) => n.remove());

    // Render dinámico
    state.addresses.forEach((a, idx) => {
      // El 0 puede mapearse al existente; los demás se agregan
      if (idx === 0) {
        // Rellena texto inicial
        const p = $("p", cont);
        if (p) p.textContent = a.text;
        const r = $("input[type='radio']", cont);
        if (r) r.checked = state.selectedAddress === 0;
        cont.dataset.id = a.id;
      } else {
        const div = document.createElement("div");
        div.className = "direccion-info mt-2";
        div.dataset.id = a.id;
        div.innerHTML = `
          <input type="radio" name="direccion" ${state.selectedAddress === idx ? "checked" : ""}>
          <p class="mb-0">${a.text}</p>`;
        wrapper.insertBefore(div, $(".btn-agregar", wrapper));
      }
    });
  };

  // Carga direcciones por defecto si no hay
  if (!state.addresses?.length) {
    // Toma el texto del HTML como dirección base si existe
    const baseTxt = $(".direccion-info p", dirRoot)?.textContent?.trim() || "Dirección predeterminada";
    state.addresses = [{ id: uid("addr"), text: baseTxt }];
    state.selectedAddress = 0;
    saveState(state);
  }
  renderAddresses();

  const btnAddAddr = $(".btn-agregar", dirRoot);
  if (btnAddAddr) {
    on(btnAddAddr, "click", (e) => {
      e.preventDefault();
      const modalEl = ensureAddressModal();
      const modal = new bootstrap.Modal(modalEl);
      modal.show();

      const saveBtn = $("#guardarDireccion");
      const form = $("#direccionForm");

      const doSave = () => {
        const data = new FormData(form);
        const alias = (data.get("alias") || "").toString().trim();
        const full = (data.get("full") || "").toString().trim();
        if (!alias || !full) return;

        const text = `${alias}: ${full}`;
        state.addresses.push({ id: uid("addr"), text });
        state.selectedAddress = state.addresses.length - 1;
        saveState(state);
        renderAddresses();
        modal.hide();
        showToast("Dirección agregada", alias, "success");
      };

      on(saveBtn, "click", (ev) => {
        ev.preventDefault();
        doSave();
      }, { once: true });
    });
  }

  // Cambiar dirección seleccionada
  on(dirRoot, "change", (e) => {
    if (e.target.matches("input[type='radio'][name='direccion']")) {
      const all = $$("input[type='radio'][name='direccion']", dirRoot);
      state.selectedAddress = all.indexOf(e.target);
      saveState(state);
      showToast("Dirección seleccionada", `Opción #${state.selectedAddress + 1}`, "info");
    }
  });

  // --------- Slider (galería secundaria) con flechas ← → ---------
  const sliderRoot = $(".galeria-secundaria");
  const moveSlider = (dir = 1) => {
    if (!sliderRoot) return;
    const radios = $$("input[type='radio']", sliderRoot);
    let idx = radios.findIndex((r) => r.checked);
    if (idx < 0) idx = 0;
    idx = (idx + dir + radios.length) % radios.length;
    radios[idx].checked = true;
  };
  on(window, "keydown", (e) => {
    if (e.key === "ArrowRight") moveSlider(1);
    if (e.key === "ArrowLeft") moveSlider(-1);
  });

  // --------- Acciones de los botones del resumen ---------
  const btnPagar = $(".btn-principal", summaryRoot);
  const btnSec = $(".btn-secundario", summaryRoot);
  on(btnPagar, "click", () => {
    const items = state.items.reduce((a, it) => a + it.qty, 0);
    showToast("Ir a pago", `Llevas ${items} artículo(s).`, "primary");
  });
  on(btnSec, "click", () => {
    showToast("Acción secundaria", "Puedes definirlo en la reestructura.", "secondary");
  });

  // --------- Tooltips demo ---------
  // Puedes poner data-bs-toggle="tooltip" en botones del HTML para activarlos.
  initTooltips();

  // --------- Primera ejecución ---------
  recalc();
})();
