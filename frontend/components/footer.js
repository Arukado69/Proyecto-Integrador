document.addEventListener("DOMContentLoaded", () => {
  fetch("/components/footer.html")
    .then(response => {
      if (!response.ok) throw new Error("No se pudo cargar el footer");
      return response.text();
    })
    .then(data => {
      document.querySelector("footer").outerHTML = data;
    })
    .catch(error => console.error(error));
});