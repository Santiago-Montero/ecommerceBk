let productosDao
let carritosDao
let usuariosDao

const ProductosDaoMongoDb = require('./productos/ProductosMongo.js')
const UsuariosDaoMongoDb = require('./usuarios/UsuariosMongo.js')
const CarritosDaoMongoDb = require('./carritos/CarritosMongo.js')
productosDao = new ProductosDaoMongoDb()
carritosDao = new CarritosDaoMongoDb()
usuariosDao = new UsuariosDaoMongoDb()

module.exports = {
    productosDao,
    usuariosDao,
    carritosDao
};