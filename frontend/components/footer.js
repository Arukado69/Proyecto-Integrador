document.addEventListener("DOMContentLoaded", () => { 
fetch("../components/footer.html")
    .then(response => {
      if (!response.ok) throw new Error("No se pudo cargar el footer");
      return response.text();
    })
    .then(data => {
document.body.insertAdjacentHTML("beforeend", data);
    })
    .catch(error => console.error(error));
});
