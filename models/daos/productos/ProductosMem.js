class ProductosDaoMem {

    constructor() {
        this.productos = []
    }
    getAll() {
        return this.productos ;
    }

    save(elemento) {
        this.productos.push(elemento)
    }
}

module.exports = ProductosDaoMem