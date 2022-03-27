const { Router }  = require('express')
const express = require("express");
const path  = require('path');
const session = require("express-session");
const handlebars = require("express-handlebars");
const compression = require("compression");
const { db } = require('../contenedores/daos/session.js')
const {
    getLogIn,
    getRegister,
    postRegister,
    getInfo,
    getRandom, 
    getlogout,
    postUser,
    getProducto,
    getProductos,
    getAdmin,
    postCargarProducto,
    getCarrito,
    getCompraCarrito,
    getCompra,
    auth } = require('./controller')



const app = express();
app.use(compression());
app.use(express.json());


const routerProductos =  Router();
const routerCarritos = Router();

// routerProductos.use(express.static(path.join('\public\css')));
// routerCarritos.use(express.static(path.join('\public')));

routerProductos.use('/css', express.static(__dirname + '/public'));

// PROBLEMAS CON EL CSS 


app.use("/api/productos/", routerProductos);
app.use("/api/carritos/", routerCarritos);

app.engine("handlebars", handlebars.engine());
app.set("views", "./public/views");
app.set("view engine", "handlebars");


routerProductos.use(session(db));
routerCarritos.use(session(db));

routerProductos.use(express.json());
routerCarritos.use(express.json());

app.use(express.urlencoded({ extended: true}));
routerProductos.use(express.urlencoded({extended: true }));
routerCarritos.use(express.urlencoded({extended: true }));


app.get('/', getLogIn)
app.get('/info', getInfo)
app.get('/api/random', getRandom)
app.get('/register', getRegister)

app.post('/register', postRegister)
routerProductos.get('/logout', auth, getlogout)
routerProductos.get('/', auth, getProductos)
routerProductos.get('/:id', auth, getProducto)
routerProductos.get('/admin', auth, getAdmin)
routerCarritos.get('/', auth, getCarrito)
routerCarritos.get('/compra', auth, getCompraCarrito)
routerCarritos.get('/:codigo', auth, getCompra)
routerProductos.post('/user', auth, postUser)
routerProductos.post('/user', auth, postCargarProducto)


module.exports = {
    routerProductos,
    routerCarritos,
    app
}