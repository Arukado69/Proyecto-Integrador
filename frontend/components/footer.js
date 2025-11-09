document.addEventListener("DOMContentLoaded", () => {
  // ¿Estoy en el index (raíz) o en una página interna?
  const isRoot = location.pathname.endsWith("/index.html") ||
                 !location.pathname.includes("/frontend/pages/");
  const prefix = isRoot ? "frontend/" : "../";

  // 1) Traer el HTML del footer desde el lugar correcto
  fetch(prefix + "components/footer.html")
    .then((r) => { if (!r.ok) throw new Error("No se pudo cargar el footer"); return r.text(); })
    .then((html) => {
      // 2) Reescribir rutas internas del footer (solo rutas, no estructura)
      //    En tu footer.html los assets/enlaces empiezan con "/assets" o "/pages"
      html = html
        .replaceAll('src="/assets/', `src="${prefix}assets/`)
        .replaceAll('href="/pages/', `href="${prefix}pages/`);

      // 3) Insertar al final del body
      document.body.insertAdjacentHTML("beforeend", html);
    })
    .catch((e) => console.error(e));
});

