// Utilidades simples para leer datos previos (si existen) y poblar la UI
const $ = (s) => document.querySelector(s);

function genOrderId() {
  // Mezcla timestamp + aleatorio en base36
  return (Date.now().toString(36) + Math.random().toString(36).slice(2, 7)).toUpperCase();
}

function fmtMoney(n) {
  if (isNaN(n)) return "$—";
  return n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

document.addEventListener("DOMContentLoaded", () => {
  // Fallbacks si no hay info en localStorage
  const checkout = JSON.parse(localStorage.getItem("checkout") || "{}");
  const cartTotal = Number(localStorage.getItem("cartTotal") || 0);

  const name = checkout.nombre || "Cliente";
  const payMethod = checkout.pago || "Tarjeta";
  const total = cartTotal || checkout.total || 0;

  const now = new Date();
  const eta = addDays(now, 3);

  const orderId = genOrderId();
  localStorage.setItem("lastOrderId", orderId);  // por si quieres leerlo en "pedido.html"

  // Pintar datos
  $("#customerName").textContent = name;
  $("#orderId").textContent = orderId;
  $("#orderDate").textContent = now.toLocaleDateString("es-MX", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
  $("#orderPay").textContent = payMethod;
  $("#orderTotal").textContent = fmtMoney(total);
  $("#orderEta").textContent = eta.toLocaleDateString("es-MX", {
    day: "2-digit", month: "short"
  });

  // Acciones
  $("#btnSeguir").addEventListener("click", () => {
    // Limpia carrito y regresa al inicio/catálogo
    localStorage.removeItem("cart");
    window.location.href = "./catalogo.html";
  });

  $("#btnImprimir").addEventListener("click", () => window.print());

  $("#btnVer").addEventListener("click", () => {
    // Llévalo a una hipotética página de pedido con el id
    window.location.href = `./pedido.html?id=${orderId}`;
  });

  $("#closeCard").addEventListener("click", () => {
    // Oculta la tarjeta (por si quieren seguir navegando)
    document.querySelector(".confirm-card").style.display = "none";
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Año en footer
  $("#year").textContent = new Date().getFullYear();
});
