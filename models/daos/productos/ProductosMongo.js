const ContenedorMongoDb = require("../../ContenedorMongo")

class ProductosDaoMongoDb extends ContenedorMongoDb {

    constructor() {
        super('productos', {
            nombre: { type: String, required: true },
            precio: { type: Number, required: true },
            descripcion: { type: String, required: true },
            foto: { type: String, required: true },
            stock: { type: Number, required: true },
            timestamp: { type: Date, required: true },
            codigo: { type: Number, required: true }
        })
    }
}

module.exports = ProductosDaoMongoDb;