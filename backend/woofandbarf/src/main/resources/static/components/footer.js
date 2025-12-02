(function () {
  // Detecta la raíz del sitio a partir de /components/footer.js
  function getSiteRoot() {
    const scripts = document.getElementsByTagName("script");
    let footerScript = null;

    for (const s of scripts) {
      if (s.src && s.src.includes("footer.js")) {
        footerScript = s;
        break;
      }
    }

    if (!footerScript) return "";

    try {
      const url = new URL(footerScript.src, window.location.href);
      const path = url.pathname; // ej: /components/footer.js, /docs/components/footer.js, /Proyecto-Integrador/docs/components/footer.js

      const marker = "/components/";
      const idx = path.lastIndexOf(marker);

      if (idx !== -1) {
        // Todo lo que está ANTES de /components/
        return path.slice(0, idx); // "" | "/docs" | "/Proyecto-Integrador/docs"
      }

      // Fallback muy defensivo
      const withoutFile = path.substring(0, path.lastIndexOf("/")); // /docs/components
      const root = withoutFile.substring(0, withoutFile.lastIndexOf("/")); // /docs
      return root === "/" ? "" : root;
    } catch (e) {
      console.warn("[Footer] No se pudo calcular siteRoot, usando '' por defecto.", e);
      return "";
    }
  }

  function injectFooter() {
    const siteRoot = getSiteRoot(); // "" | "/docs" | "/Proyecto-Integrador/docs"
    const footerUrl = siteRoot + "/components/footer.html";

    fetch(footerUrl)
      .then((r) => {
        if (!r.ok) {
          throw new Error("No se pudo cargar el footer desde: " + footerUrl);
        }
        return r.text();
      })
      .then((html) => {
        // Ajustar rutas internas del footer según la raíz real
        const fixed = html
          // imágenes
          .replaceAll('src="/assets/', `src="${siteRoot}/assets/`)
          // links a páginas
          .replaceAll('href="/pages/', `href="${siteRoot}/pages/`);

        // Usar el <footer></footer> que ya tienes como placeholder
        const placeholder = document.querySelector("footer");
        if (placeholder) {
          placeholder.outerHTML = fixed;
        } else {
          document.body.insertAdjacentHTML("beforeend", fixed);
        }
      })
      .catch((err) => {
        console.error("[Footer] Error al inyectar footer:", err);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectFooter);
  } else {
    injectFooter();
  }
})();
