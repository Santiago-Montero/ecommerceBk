const { transporter } = require('../comunicacion/mail')
const { logger } = require('./logs')
const {
    saveUser,
    getProduct,
    getProducts,
    getRandomNumber,
    getUser,
    getCotizacion,
    postProduct } = require('../services/services')


const {info, memoria, argsDeEntrada, PORT, MODE } = require('../process.js')
/* Inicio */

async function getInfo(req, res) {
    console.log(await getCotizacion());
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
    const usuario = await saveUser(newUsuario) ;

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
        codigo: getRandomNumber()
    };
    if (await postProduct(productoNuevo)) {
        const productos = await getProducts()
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
    const productos = await getProducts();
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
    const productoViejo = await getProduct(id)
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
    const productos = await getProducts();
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
    const usuario_db = await getUser(user_mail);
    if(usuario_db){
        if(usuario_db[0].password == user_password){
            if(!req.session.user) req.session.user = usuario_db[0]
            if(!req.session.admin) req.session.admin = usuario_db[0].admin == true ? true : false
            const carrito = {
                user : req.session.user,
                productos : []
            }
            if(!req.session.carrito) req.session.carrito = carrito
            const productos = await getProducts() ;
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
    auth 
}
