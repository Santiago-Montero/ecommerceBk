let productosDao
// let carritosDao

const ProductosDaoMongoDb = require('./productos/ProductosMongo.js')
const UsuariosDaoMongoDb = require('./usuarios/UsuariosMongo.js')

// const CarritosDaoMongoDb = require('./carrito/CarritosDaoMongoDb.js.js')
productosDao = new ProductosDaoMongoDb()
// carritosDao = new CarritosDaoMongoDb()

usuariosDao = new UsuariosDaoMongoDb()

module.exports = {
    productosDao,
    usuariosDao,
    // carritosDao
};