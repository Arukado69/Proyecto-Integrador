document.addEventListener("DOMContentLoaded", () => {
  // Index ahora vive en /frontend; las páginas en /frontend/pages
  const inPages = location.pathname.includes("/frontend/pages/");
  const prefix = inPages ? "../" : ""; // ../ cuando estoy en /pages, vacío en /frontend

  fetch(prefix + "components/footer.html")
    .then(r => { if (!r.ok) throw new Error("No se pudo cargar el footer"); return r.text(); })
    .then(html => {
      // Corrige rutas absolutas escritas dentro del footer.html
      html = html
        .replaceAll('src="/assets/', `src="${prefix}assets/`)
        .replaceAll('href="/pages/', `href="${prefix}pages/`);
      document.body.insertAdjacentHTML("beforeend", html);
    })
    .catch(console.error);
});
