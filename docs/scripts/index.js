// Initialize a new TaskManager with currentId set to 0
const itemsController = new ItemsController(0);

// Select the New Task Form
const newItemForm = document.querySelector('#newItemForm');

// Add an 'onsubmit' event listener
newItemForm.addEventListener('submit', (event) => {
    // Prevent default action
    event.preventDefault();

    // Select the inputs
    const newItemNameInput = document.querySelector('#newItemNameInput');
    const newItemContentInput = document.querySelector('#newItemContent');
    const newItemPriceInput = document.querySelector('#newItemPrice');
    const newItemDescriptionInput = document.querySelector('#newItemDescription');
    const newItemImagenInput = document.querySelector('#newItemImagen');


    /*
        Validation code here
    */

    // Get the values of the inputs
    const name = newItemNameInput.value;
    const content = newItemContentInput.value;
    const price = newItemPriceInput.value;
    const description = newItemDescriptionInput.value;
    const imagen = newItemImagenInput.content;
    const createdAt = new Date();

    // Add the task to the task manager
    itemsController.addItem(name,content, price, description,imagen, createdAt);

    // Clear the form
    newItemNameInput.value = '';
    newItemContentInput.value = '';
    newItemPriceInput.value = '';
    newItemDescriptionInput.value = '';
    newItemImagenInput.value = '';
});


function addItemCard(item){
    const itemHTML = '<div class="card" style="width: 18rem;">\n' +
        '    <img src="'+item.img +'" class="card-img-top" alt="image">\n' +
        '    <div class="card-body">\n' +
        '        <h5 class="card-title">'+item.name+'</h5>\n' +
        '        <p class="card-text">'+item.description+'</p>\n' +
        '        <a href="#" class="btn btn-primary">Add</a>\n' +
        '    </div>\n' +
        '</div>\n' +
        '<br/>';
    const itemsContainer = document.getElementById("list-items");
    itemsContainer.innerHTML += itemHTML;
}

addItemCard({'name':'juice',
    'img':'https://www.gs1india.org/media/Juice_pack.jpg',
    'description':'Orange and Apple juice fresh and delicious'});

