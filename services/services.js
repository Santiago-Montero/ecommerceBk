const { productosDao } = require("../models/daos/index.js");
const { usuariosDao } = require("../models/daos/index.js");
const { carritosDao } = require("../models/daos/index.js");



async function saveUser(user){
    return await usuariosDao.save(user);
}
async function getProduct(id){
    return await productosDao.getByCodigo(id);
}
async function getCotizacion(id){
    return await productosDao.buscarConCotizacionEnDolares(id);
}
async function getProducts(){
    
    return await productosDao.getAll();
}
function getRandomNumber(){
    return Number(productosDao.getRandom())
}
async function getUser(user_mail){
    return await usuariosDao.getByMail(user_mail);
}
async function postProduct(product){
    return await productosDao.save(product);
}
async function postCart(cart){
    return await carritosDao.save(cart);
}


module.exports  = { 
    saveUser,
    getProduct,
    getProducts,
    getRandomNumber,
    getUser,
    postProduct,
    postCart,
    getCotizacion,
}