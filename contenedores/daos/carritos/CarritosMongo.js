// Carritos 
// personas 
const ContenedorMongoDb = require("../../ContenedorMongo")

class CarritosDaoMongoDb extends ContenedorMongoDb {

    constructor() {
        super('carrito', {
            persona: { type: Object, required: true },
            productos: { type: Array, required: true }
        })
    }
}

module.exports = CarritosDaoMongoDb;