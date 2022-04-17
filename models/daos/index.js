let productosDao
let carritosDao
let usuariosDao
let productosMem

const ProductosDaoMongoDb = require('./productos/ProductosMongo.js')
const ProductosDaoMem = require('./productos/ProductosMem')
const UsuariosDaoMongoDb = require('./usuarios/UsuariosMongo.js')
const CarritosDaoMongoDb = require('./carritos/CarritosMongo.js')
productosDao = new ProductosDaoMongoDb()
carritosDao = new CarritosDaoMongoDb()
usuariosDao = new UsuariosDaoMongoDb()
productosMem = new ProductosDaoMem()

module.exports = {
    productosDao,
    productosMem,
    usuariosDao,
    carritosDao
};