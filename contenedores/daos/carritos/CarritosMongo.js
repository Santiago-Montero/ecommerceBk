const ContenedorMongoDb = require("../../ContenedorMongo")

class CarritosDaoMongoDb extends ContenedorMongoDb {

    constructor() {
        super('carritos', {
            user: { type: Object, required: true },
            productos: { type: Array, required: true }
        })
    }
}

module.exports = CarritosDaoMongoDb;