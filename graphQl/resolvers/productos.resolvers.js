class Producto {

    constructor(id, nombre, precio){
        this.id = id,
        this.nombre = nombre,
        this.precio = precio
    }
}

const productosDB = {}

function getAll(){
    const productos = Object.values(productosDB)
    return productos
}

function createProducto(producto){
    const id = Math.random() * (1 - 1000) + 1
    const productoNuevo = new Producto(id, producto.nombre, producto.precio)
    productosDB[id] = productoNuevo
    return productoNuevo;
}

module.exports = {
    getAll,
    createProducto
}