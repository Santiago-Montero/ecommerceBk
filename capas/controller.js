const { productosDao } = require("../contenedores/daos/index.js");
const { usuariosDao } = require("../contenedores/daos/index.js");
const { carritosDao } = require("../contenedores/daos/index.js");
const { transporter } = require('../comunicacion/mail')
const { client } = require('../comunicacion/mensaje')
const { logger } = require('./logs')

const {info, memoria, argsDeEntrada, PORT, MODE } = require('../process.js')
/* Inicio */ 

async function getInfo(req, res) {
    logger.info('Esta en la ruta /info por el metodo GET')
    res.render("info", {
        info_exist: info ? true : false,
        info,
        memoria,
        argsDeEntrada_exist: argsDeEntrada[0]._.length > 0 ? true : false,
        argsDeEntrada,
    });
}
async function getRandom(req, res) {
    console.log(`Get randoms [${process.pid}]  PORT :${PORT}`)
    res.send('Random') // cluster
}
async function getLogIn(req, res) {
    logger.info('Esta en la ruta / por el metodo GET ')
    res.render("logIn");
}
async function getRegister(req, res) {
    logger.info('Esta en la ruta /register por el metodo GET ')
    res.render("register");
}

async function postRegister(req, res) {
    logger.info('Esta en la ruta /register por el metodo POST ')
    const newUsuario = req.body 
    const usuario = await usuariosDao.save(newUsuario);

    const mailOptions = {
        from: configEnv.MAIL_ADMIN,
        to: configEnv.MAIL_ADMIN,
        subject: 'Se registro un nuevo ususario',
        html: `<h1 style="color: blue;">Se registro <span style="color: green;">${usuario.mail}</span></h1>`
    }
    transporter.sendMail(mailOptions)
    .then((res) => console.log(res))
    .catch((err) => console.log(err))
    // agregar validacion

    res.render("logIn");
}

/* CARRITO */

async function getCompra(req, res) {
    const codigo = req.params.codigo
    const carrito = req.session.carrito
    const productoAgregado = await productosDao.getByCodigo(codigo);
    if (productoAgregado) carrito.productos.push(productoAgregado)
    const carritoAgregado = await carritosDao.save(carrito)
    console.log(carritoAgregado);
    const productos = await productosDao.getAll();
    res.render("home", {
        productos,
        productsExist: productos ? true : false,
        user : req.session.user,
        admin : req.session.admin
    });
}
async function getCompraCarrito(req, res) {
    const carrito = req.session.carrito
    const productosCarrito = carrito.productos
    let lista = ``
    productosCarrito.forEach( producto => {
        lista += producto.nombre+'\n'
    })
    //nuevo pedido de
    
    const mailOptions = {
        from: configEnv.MAIL_ADMIN, 
        to: configEnv.MAIL_ADMIN,
        subject: 'Nuevo pedido de '+req.session.user.mail,
        html: `<h1 style="color: blue;">El usuario compro `+ lista
    }
    transporter.sendMail(mailOptions)
    .then((res) => console.log(res))
    .catch((err) => console.log(err))

    client.messages.create({
        from: 'whatsapp:+14155238886',
        body: 'Nuevo pedido de '+req.session.user.mail+' El usuario compro '+ lista,
        to: 'whatsapp:'+ configEnv.WPP_ADMIN
    })
    .then(message => console.log(message.sid))
    .catch((error) => console.log(error));

    client.messages.create({
        body: 'Su pedido fue recibido y esta en proceso...',
        from: '+18285648984',
        to: req.session.user.telefono
    })
    .then((message) =>  console.log(message))
    .catch((error) =>  console.log(error))
    const productos = await productosDao.getAll();
    res.render("home", {
        productos,
        productsExist: productos ? true : false,
        user : req.session.user,
        admin : req.session.admin
    });
}
async function getCarrito(req, res) {
    const carrito = req.session.carrito
    console.log(carrito);
    res.render("carrito", {
        carrito,
        productos : carrito.productos,
        carritoExist: carrito.productos.length >= 1 ? true : false,
        user : req.session.user
    });
}


/* PRODUCTOS */
async function postCargarProducto(req, res) {
    logger.info('Esta en la ruta /api/productos/ por el metodo POST')
    const { nombre, descripcion, stock, precio, foto } = req.body;
    const productoNuevo = {
        nombre,
        descripcion,
        stock,
        precio,
        foto,
        timestamp: moment().format("l"),
        codigo: Number(productosDao.getRandom())
    };
    if (await productosDao.save(productoNuevo)) {
        const productos = await productosDao.getAll();
        res.render("home", {
            productos,
            productsExist: productos ? true : false,
            admin : req.session.admin
        });
    } else {
        mensaje = "No se pudo crear el producto";
        logger.error(mensaje);
        errorType = "500";
        res.render("error", {
            errorType,
            mensaje,
            error: mensaje ? true : false,
        });
    }
}
async function getAdmin(req, res) {
    logger.info('Esta en la ruta /api/productos/admin por el metodo GET')
    const productos = await productosDao.getAll();
    if (req.session.admin) {
        res.render("home", {
            productos,
            productExist: productos ? true : false,
            admin : req.session.admin,
        });
    } else {
        mensaje = "No tiene permiso para estar aca";
        logger.warn(mensaje);
        errorType = "404";
        res.render("error", {
            errorType,
            mensaje,
            error: mensaje ? true : false,
        });
        // res.status(404).json(mensaje);
    }
}
async function getProducto(req, res) {
    const id = req.params.id;
    logger.info('Esta en la ruta /api/productos/'+ id+' por el metodo GET')
    console.log(id);
    const productoViejo = await productosDao.getByCodigo(id);
    if(productoViejo){
        console.log(productoViejo)
        res.render("actualizar", {
            productoViejo,
            productExist: productoViejo ? true : false,
        });
    }else{
        mensaje = "No se encontro ese producto";
        logger.warn(mensaje);
        errorType = "404";
        res.render("error", {
            errorType,
            mensaje,
            error: mensaje ? true : false,
        });
        // res.status(404).json(mensaje);
    }
}
async function getProductos(req, res) {
    logger.info('Esta en la ruta /api/productos/ por el metodo GET')
    // carga de productos
    const productos = await productosDao.getAll();
    res.render("home", {
        productos,
        productsExist: productos ? true : false,
        user :  req.session.user,
        admin : req.session.admin
    });
}

async function postUser(req, res) {
    logger.info('Esta en la ruta /api/productos/user por el metodo POST')

    const user_mail = req.body.mail;
    const user_password = req.body.password;
    const usuario_db = await usuariosDao.getByMail(user_mail);
    if(usuario_db){
        if(usuario_db[0].password == user_password){
            if(!req.session.user) req.session.user = usuario_db[0]
            if(!req.session.admin) req.session.admin = usuario_db[0].admin == true ? true : false
            const carrito = {
                user : req.session.user,
                productos : []
            }
            if(!req.session.carrito) req.session.carrito = carrito
            const productos = await productosDao.getAll();
            res.render("home", {
                productos,
                productsExist: productos ? true : false,
                user : usuario_db[0],
                admin : req.session.admin
            });
        }else{
            mensaje = "Mail o contraseña incorrecta";
            logger.warn(mensaje);
            errorType = "404";
            res.render("error", {
                errorType,
                mensaje,
                error: mensaje ? true : false,
            });
        }
    }else {
        mensaje = "Ingresa Para poder ver los productos";
        logger.warn(mensaje);
        errorType = "404";
        res.render("error", {
            errorType,
            mensaje,
            error: mensaje ? true : false,
        });
    }
}

const auth = (req, res, next) => {
    if (req.session.user) {
        if(!req.session.admin) req.session.admin = req.session.user.admin == true ? true : false
        console.log(req.session.admin);
        console.log('estoy en auth');
        return next();
    } else {
        mensaje = "Error de autorizacion";
        logger.warn(mensaje);
        errorType = "401";
        res.render("error", {
            errorType,
            mensaje,
            error: mensaje ? true : false,
        });
    }
};

function getlogout(req, res) {
    logger.info('Esta en la ruta /logout por el metodo GET')
    req.session.destroy((error) => {
        if (error) {
            mensaje = "Hubo un error al salir";
            logger.error(mensaje);
            errorType = "500";
            res.render("error", {
                errorType,
                mensaje,
                error: mensaje ? true : false,
            });
        } else res.render("logIn");
    });
}

module.exports  = { 
    getLogIn,
    getRegister,
    postRegister,
    getInfo,
    getRandom,   
    getlogout, 
    postUser, 
    getProductos,
    getProducto,
    getAdmin,
    postCargarProducto,
    getCarrito,
    getCompraCarrito,
    getCompra,
    auth 
}
