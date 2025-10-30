const productRow = document.getElementById('product-row');

// 3. Función para generar el HTML de una tarjeta
function createProductCard(item) {
    return `
    <div class="col-md-4 d-flex justify-content-center align-items-center catalogo-div-card">
        <div class="card rounded-5">
            <div class="card-body text-center">
                <img src="${item.imageURL}" class="catalogo-img-size rounded-5 mb-3" alt="${item.name}">
                <h4 class="card-title catalogo-roboto-h4 mb-4">${item.name}</h4>
                <h4 class="card-text catalogo-price-color catalogo-roboto-h4 mb-5">$${item.price}</h4>
                <div class="d-grid gap-2">
                    <button class=" btn rounded-4 catalogo-secundary-button-color catalogo-roboto-primary-label" type="button">Añadir al carrito</button>
                </div>
            </div>
        </div>
    </div>
    `;
}

// 4. Función para renderizar todos los productos
function renderProducts() {
    let cardsHtml = ''; 
    
    // 5. Iteramos sobre la variable global 'listaDeProductos' del otro archivo
    for (const item of listaDeProductos) {
        cardsHtml += createProductCard(item);
    }

    productRow.innerHTML = cardsHtml;
}

// 6. Llama a la función
renderProducts();