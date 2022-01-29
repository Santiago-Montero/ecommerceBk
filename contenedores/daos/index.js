let productosDao
// let carritosDao

const ProductosDaoMongoDb = require('./productos/ProductosMongo.js')
// const CarritosDaoMongoDb = require('./carrito/CarritosDaoMongoDb.js.js')
productosDao = new ProductosDaoMongoDb()
// carritosDao = new CarritosDaoMongoDb()

module.exports = {
    productosDao,
    // carritosDao
};