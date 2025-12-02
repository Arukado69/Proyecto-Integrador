class itemsController{
    constructor(currentId = 0){
        this.items = [];
        this.currentID = currentId;
    }
    //creando metodo para añadir producto
    addItem(name, content, price, description, imageURL){
        const producto = {
            id : this.currentID++,
            name : name,
            content : content,
            price : price,
            description : description,
            imageURL : imageURL
        };

        this.items.push(producto);

    }
}