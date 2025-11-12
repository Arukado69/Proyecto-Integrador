/* === Woof & Barf · Carrito animado (sin tocar HTML) ===
   - Estado centralizado + persistencia (localStorage)
   - Antirrebote en +/−, contador en ícono
   - Cupones: WOOF10 (-10%), ENVIOGRATIS (envío $0)
   - Estimador de entrega por CP (2–4 días hábiles)
   - Recomendaciones en carousel con skeleton + load fade
   - Totales = (subtotal - descuento) + IVA + envío
   - Toasts Bootstrap para feedback + "Deshacer" en eliminar
*/
(() => {
  // --------- Constantes / DOM
  const LS_CART   = 'cart:v1';
  const LS_COUPON = 'coupon:v1';

  const $miniCount = $('#miniCount');
  const $lista     = $('#listaItems');
  const $vacio     = $('#estadoVacio');
  const $hint      = $('#hintMostrando');

  const $rSubtotal = $('#rSubtotal');
  const $rDescuento= $('#rDescuento');
  const $rEnvio    = $('#rEnvio');
  const $rIva      = $('#rIva');
  const $rTotal    = $('#rTotal');

  const $btnVaciar = $('#btnVaciar');
  const $btnPagar  = $('#btnPagar');

  const $cupon         = $('#cupon');
  const $btnCupon      = $('#btnAplicarCupon');
  const $cuponFeedback = $('#cuponFeedback');

  const $cp         = $('#cp');
  const $btnCP      = $('#btnCalcularCP');
  const $cpResultado= $('#cpResultado');

  const $recoSlides = $('#recoSlides');
  const $toasts     = $('#toasts');

  // --------- Helpers
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
  const money = n => Number(n || 0).toLocaleString('es-MX', { style:'currency', currency:'MXN' });
  const safeJSON = s => { try{ return JSON.parse(s) } catch { return null } };

  const COUPONS = {
    'WOOF10':      { type:'percent', value:0.10, label:'10% de descuento' },
    'ENVIOGRATIS': { type:'shipping', value:1,    label:'Envío gratis' }
  };

  // --------- Estado central
  const state = {
    items: readCart(),
    coupon: readCoupon(),

    get subtotal(){
      return this.items.reduce((acc,it)=> acc + (Number(it.price)||0)*(Number(it.qty)||0), 0);
    },
    get discount(){
      const c = this.coupon;
      if (!c) return 0;
      if (c.type === 'percent') return +(this.subtotal * c.value).toFixed(2);
      return 0;
    },
    get envio(){
      const after = Math.max(0, this.subtotal - this.discount);
      let envio = (after >= 499 || after === 0) ? 0 : 89;
      if (this.coupon?.type === 'shipping') envio = 0;
      return envio;
    },
    get iva(){
      return +((Math.max(0, this.subtotal - this.discount)) * 0.16).toFixed(2);
    },
    get total(){
      return Math.max(0, this.subtotal - this.discount) + this.iva + this.envio;
    }
  };

  // --------- Storage
  function readCart(){
    const data = safeJSON(localStorage.getItem(LS_CART));
    return Array.isArray(data) ? data : [];
  }
  function writeCart(list){
    state.items = list;
    localStorage.setItem(LS_CART, JSON.stringify(list));
    updateBadge();
  }
  function readCoupon(){
    return safeJSON(localStorage.getItem(LS_COUPON)) || null;
  }
  function writeCoupon(c){
    state.coupon = c;
    if (c) localStorage.setItem(LS_COUPON, JSON.stringify(c));
    else localStorage.removeItem(LS_COUPON);
  }

  // --------- Throttle para +/−
  const throttles = new Map();
  function throttle(key, ms=180){
    const now = Date.now(), last = throttles.get(key) || 0;
    if (now - last < ms) return false;
    throttles.set(key, now);
    return true;
  }

  // --------- Render
  function render(){
    const list = state.items;

    // Estado vacío
    if (!list.length){
      $lista.innerHTML = '';
      $vacio.classList.remove('d-none');
      $hint.textContent = 'Mostrando 0 artículos';
      paintTotals();
      updateBadge();
      return;
    }
    $vacio.classList.add('d-none');
    $hint.textContent = `Mostrando ${list.length} artículo${list.length===1?'':'s'}`;

    $lista.innerHTML = list.map(itemTemplate).join('');

    // Delegación de eventos de items
    $$('#listaItems [data-btn="plus"]').forEach(b => b.addEventListener('click', onPlus));
    $$('#listaItems [data-btn="minus"]').forEach(b => b.addEventListener('click', onMinus));
    $$('#listaItems [data-btn="remove"]').forEach(b => b.addEventListener('click', onRemove));
    $$('#listaItems [data-btn="fav"]').forEach(b => b.addEventListener('click', e => e.currentTarget.classList.toggle('active')));

    // QTY bounce visual
    requestAnimationFrame(() => {
      $$('#listaItems .qty-input').forEach(q => {
        q.classList.remove('qty-bounce'); void q.offsetWidth; q.classList.add('qty-bounce');
      });
    });

    paintTotals();
    updateBadge();
  }

  function itemTemplate({ id, name, price, qty, image, meta }){
    const src = image || '../assets/imagenes/productos/placeholder.png';
    const q = Number(qty)||1;
    const metaText = meta || 'Paquete 500 g';
    return `
      <article class="item reveal-on-scroll">
        <img class="item-img" src="${src}" alt="${escapeHtml(name||'Producto')}" onerror="this.src='../assets/imagenes/productos/placeholder.png'">
        <div class="item-info">
          <h3 class="item-title">${escapeHtml(name||'Producto')}</h3>
          <div class="item-meta">${escapeHtml(metaText)}</div>
          <div class="item-price mt-1">${money(price)}</div>
          <div class="small text-muted mt-1">
            <span class="badge text-bg-light">Fresco</span>
            <span class="badge text-bg-light">Sin conservadores</span>
          </div>
        </div>
        <div class="item-qty">
          <button class="qty-btn" data-btn="minus" data-id="${id}" aria-label="Restar">−</button>
          <input class="qty-input" value="${q}" inputmode="numeric" aria-label="Cantidad" readonly>
          <button class="qty-btn" data-btn="plus" data-id="${id}" aria-label="Sumar">+</button>
        </div>
        <div class="item-actions">
          <button class="fav" data-btn="fav" title="Mover a favoritos"><i class="bi bi-heart"></i></button>
          <button class="btn-remove" data-btn="remove" data-id="${id}" title="Eliminar"><i class="bi bi-x-lg"></i> Eliminar</button>
        </div>
      </article>
    `;
  }

  function escapeHtml(s){ return String(s??'').replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }

  // --------- Totales
  function paintTotals(){
    $rSubtotal.textContent = money(state.subtotal);
    $rDescuento.textContent= '−' + money(state.discount);
    $rEnvio.textContent    = money(state.envio);
    $rIva.textContent      = money(state.iva);
    $rTotal.textContent    = money(state.total);
    $btnPagar.disabled     = state.items.length === 0;
  }

  function updateBadge(){
    const count = state.items.reduce((a,it)=> a+(Number(it.qty)||0), 0);
    if ($miniCount) $miniCount.textContent = String(count);
  }

  // --------- Handlers (items)
  function onPlus(e){
    const id = e.currentTarget.dataset.id;
    if (!throttle('plus:'+id)) return;
    const i = state.items.findIndex(it => String(it.id) === String(id));
    if (i>=0){
      state.items[i].qty = Math.min(99, Number(state.items[i].qty||1)+1);
      writeCart(state.items); render(); toast('Cantidad actualizada','primary');
    }
  }

  function onMinus(e){
    const id = e.currentTarget.dataset.id;
    if (!throttle('minus:'+id)) return;
    const i = state.items.findIndex(it => String(it.id) === String(id));
    if (i>=0){
      const next = Math.max(0, Number(state.items[i].qty||1)-1);
      if (next===0){
        if (!confirm('¿Eliminar este producto del carrito?')) return;
        const removed = state.items.splice(i,1)[0];
        writeCart(state.items); render();
        toast(`Producto eliminado <a href="#" data-undo='${removed.id}'>Deshacer</a>`, 'danger');
        lastRemoved = removed;
      } else {
        state.items[i].qty = next;
        writeCart(state.items); render(); toast('Cantidad actualizada','primary');
      }
    }
  }

  function onRemove(e){
    const id = e.currentTarget.dataset.id;
    const i = state.items.findIndex(it => String(it.id) === String(id));
    if (i>=0){
      const removed = state.items.splice(i,1)[0];
      writeCart(state.items); render();
      toast(`Producto eliminado <a href="#" data-undo='${removed.id}'>Deshacer</a>`, 'danger');
      lastRemoved = removed;
    }
  }
  let lastRemoved = null;

  // Undo desde toast
  $toasts.addEventListener('click', ev => {
    const id = ev.target?.getAttribute?.('data-undo');
    if (!id || !lastRemoved) return;
    ev.preventDefault();
    const exists = state.items.find(it => String(it.id)===String(id));
    if (!exists){
      state.items.push(lastRemoved);
      writeCart(state.items); render(); toast('Se restauró el producto','success');
    }
    lastRemoved = null;
  });

  // --------- Vaciar / Pagar
  $btnVaciar?.addEventListener('click', () => {
    if (!state.items.length) return;
    if (confirm('¿Vaciar todo el carrito?')){
      writeCart([]); render(); toast('Carrito vacío','secondary');
    }
  });

  $btnPagar?.addEventListener('click', () => {
    if (!state.items.length) return;
    localStorage.setItem('lastOrder', JSON.stringify({
      id: 'WBF-' + Math.random().toString(36).slice(2,8).toUpperCase(),
      date: new Date().toISOString(),
      items: state.items,
      total: state.total
    }));
    window.location.href = './confirmacion.html';
  });

  // --------- Cupones
  $btnCupon?.addEventListener('click', () => {
    const code = String($cupon.value||'').trim().toUpperCase();
    if (!code) { setFeedback($cuponFeedback,'Escribe un código.','error'); return; }
    const c = COUPONS[code];
    if (!c){ setFeedback($cuponFeedback,'Código inválido o expirado.','error'); toast('Cupón inválido','warning'); return; }
    writeCoupon({ code, ...c });
    setFeedback($cuponFeedback, `Aplicado: ${c.label}`,'ok');
    render(); toast('Cupón aplicado','success');
  });

  function setFeedback(el, text, type){
    el.textContent = text;
    el.classList.remove('ok','error');
    if (type) el.classList.add(type);
  }

  // --------- Estimador de entrega por CP
  $btnCP?.addEventListener('click', () => {
    const cp = String($cp.value||'').trim();
    if (!/^\d{5}$/.test(cp)){ $cpResultado.textContent='Ingresa un CP válido (5 dígitos).'; return; }
    const dias = 2 + Math.floor(Math.random()*3); // 2–4 días hábiles
    const fecha = addBusinessDays(new Date(), dias);
    $cpResultado.innerHTML = `Entrega estimada: <b>${fecha.toLocaleDateString('es-MX')}</b> (2–4 días hábiles).`;
    toast('Estimación generada','info');
  });

  function addBusinessDays(date, days){
    let d = new Date(date), added = 0;
    while (added < days){
      d.setDate(d.getDate()+1);
      const w = d.getDay();
      if (w!==0 && w!==6) added++;
    }
    return d;
  }

  // --------- Recomendaciones (carousel)
  const recoData = [
    { id:'r1', name:'Tenias BARF pollo 500g', price:109, image:'../assets/imagenes/productos/barf1.jpg' },
    { id:'r2', name:'Snack hígado 120g',     price:79,  image:'../assets/imagenes/productos/snack1.jpg' },
    { id:'r3', name:'Mix res 1kg',           price:199, image:'../assets/imagenes/productos/barf2.jpg' },
    { id:'r4', name:'Aceite de salmón 250ml',price:149, image:'../assets/imagenes/productos/oil.jpg' },
    { id:'r5', name:'Premio deshidratado',   price:95,  image:'../assets/imagenes/productos/snack2.jpg' },
    { id:'r6', name:'Suplemento antipulgas', price:129, image:'../assets/imagenes/productos/sup.jpg' },
    { id:'r7', name:'Pack semanal cachorro', price:499, image:'../assets/imagenes/productos/pack.jpg' },
    { id:'r8', name:'Hueso recreativo',      price:69,  image:'../assets/imagenes/productos/bone.jpg' },
  ];

  function buildRecoCarousel(){
    // skeleton mientras carga
    $recoSlides.innerHTML = `
      <div class="carousel-item active">
        <div class="row g-3">
          ${Array.from({length:4}).map(()=>`
            <div class="col-6 col-md-3">
              <div class="card reco-card h-100">
                <div class="reco-img skeleton"></div>
                <div class="card-body">
                  <div class="placeholder-wave">
                    <span class="placeholder col-8"></span>
                  </div>
                  <p class="small text-muted mb-2">&nbsp;</p>
                  <button class="btn btn-sm btn-outline-primary disabled">Agregar</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>`;

    // construir slides reales
    const chunk = 4;
    const frag = document.createDocumentFragment();
    for (let i=0; i<recoData.length; i+=chunk){
      const group = recoData.slice(i, i+chunk);
      const slide = document.createElement('div');
      slide.className = `carousel-item ${i===0 ? 'active' : ''}`;
      slide.innerHTML = `
        <div class="row g-3">
          ${group.map(r => `
            <div class="col-6 col-md-3">
              <div class="card reco-card h-100">
                <div class="reco-img">
                  <img src="${r.image}" alt="${escapeHtml(r.name)}">
                </div>
                <div class="card-body">
                  <h4 class="h6 mb-1">${escapeHtml(r.name)}</h4>
                  <p class="small text-muted mb-2">${money(r.price)}</p>
                  <button class="btn btn-sm btn-outline-primary" data-reco="${r.id}">Agregar</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>`;
      frag.appendChild(slide);
    }
    // reemplazar skeleton
    setTimeout(()=>{ $recoSlides.innerHTML=''; $recoSlides.appendChild(frag); hookReco(); lazyLoadRecoImages(); }, 400);
  }

  function hookReco(){
    $('#recoCarousel')?.addEventListener('click', e => {
      const id = e.target?.getAttribute('data-reco');
      if (!id) return;
      const prod = recoData.find(x => x.id===id);
      if (!prod) return;
      const i = state.items.findIndex(it => String(it.id)===id);
      if (i>=0) state.items[i].qty = Math.min(99, Number(state.items[i].qty||1)+1);
      else state.items.push({ id: prod.id, name: prod.name, price: prod.price, qty: 1, image: prod.image });
      writeCart(state.items); render(); toast('Agregado a tu carrito','success');
    });
  }

  function lazyLoadRecoImages(){
    $$('#recoSlides img').forEach(img=>{
      img.addEventListener('load', () => img.classList.add('loaded'), { once:true });
      const parent = img.closest('.reco-img');
      parent?.classList.remove('skeleton');
    });
  }

  // --------- Toasts Bootstrap (+ ripple en btn-dark)
  function toast(html, tone='primary'){
    const el = document.createElement('div');
    el.className = `toast align-items-center text-bg-${tone} border-0`;
    el.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${html}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
      </div>`;
    $toasts.appendChild(el);
    const t = new bootstrap.Toast(el, { delay: 2400 });
    t.show();
    el.addEventListener('hidden.bs.toast', ()=> el.remove());
  }

  // efecto luz en btn-dark (sin cambiar HTML)
  document.addEventListener('pointerdown', e => {
    const b = e.target.closest('.btn-dark');
    if (!b) return;
    const r = b.getBoundingClientRect();
    b.style.setProperty('--x', `${e.clientX - r.left}px`);
    b.style.setProperty('--y', `${e.clientY - r.top}px`);
  });

  // --------- Init
  (function seed(){
    // ?demo=1 para poblar
    if (new URL(location.href).searchParams.get('demo')==='1' && state.items.length===0){
      writeCart([
        { id:'p1', name:'Mix BARF Res x 500g', price:129, qty:1, image:'../assets/imagenes/productos/barf1.jpg' },
        { id:'p2', name:'Snack deshidratado 250g', price:89, qty:2, image:'../assets/imagenes/productos/snack1.jpg' }
      ]);
    }
  })();

  buildRecoCarousel();
  render();

})();
