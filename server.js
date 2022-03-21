const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const moment = require("moment");
const { Router } = express;
const parseArgs = require("minimist");
const compression = require("compression");
const handlebars = require("express-handlebars");
const configEnv = require("./config.js");
const { productosDao } = require("./contenedores/daos/index.js");
const { usuariosDao } = require("./contenedores/daos/index.js");
const { carritosDao } = require("./contenedores/daos/index.js");
const { transporter } = require('./comunicacion/mail')
const { client } = require('./comunicacion/mensaje')
const path = require('path');

const log4js = require("log4js");

const logger = log4js.getLogger();

log4js.configure({
    appenders: {
        miLoggerConsole: { type: "console" },
        miLoggerFile: { type: "file", filename: "info.log" },
        miLoggerFile2: { type: "file", filename: "info2.log" },
    },
    categories: {
        default: { appenders: ["miLoggerConsole"], level: "trace" },
        consola: { appenders: ["miLoggerConsole"], level: "debug" },
        archivo: { appenders: ["miLoggerFile"], level: "warn" },
        archivo2: { appenders: ["miLoggerFile2"], level: "info" },
        todos: { appenders: ["miLoggerConsole", "miLoggerFile"], level: "error" },
    },
});



console.log("NODE_ENV : " + configEnv.NODE_ENV);

const app = express();
const routerProductos = Router();
const routerCarritos = Router();

const args = parseArgs(process.argv.slice(2));

// console.log(args.modo)

// app.listen(args.port || 3000)
// pm2 start server.js --name="Server1" --watch -- 8081 FORK
// pm2 start server.js --name="Server2" --watch  -i max -- 8082 CLUSTER
const PORT = parseInt(process.argv[2]) || 8080; 
const MODE = process.argv[3] || 'CLUSTER'
app.listen( process.env.PORT || 8080);

// routerProductos.use(express.static("./public/views/css"));
// routerProductos.use(express.static("./public/views/js"));
routerProductos.use(express.static(path.join(__dirname, 'public/css')));
routerProductos.use(express.static(path.join(__dirname, 'public/js')));
routerCarritos.use(express.static(path.join(__dirname, 'public/css')));
routerCarritos.use(express.static(path.join(__dirname, 'public/js')));
// app.use(express.static(path.join(__dirname, 'public/css')));
// app.use(express.static(path.join(__dirname, 'public/js')));
app.use(compression());
app.use(express.json());
app.use("/api/productos/", routerProductos);
app.use("/api/carritos/", routerCarritos);

// para tomar los datos por body
routerProductos.use(express.json());
routerCarritos.use(express.json());
app.use(express.urlencoded({ extended: true}));
routerProductos.use(express.urlencoded({extended: true }));
routerCarritos.use(express.urlencoded({extended: true }));

// para tomar los datos por body

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const uri = configEnv.DB_URL_SESSION;
const db = {
    store : new MongoStore({
        mongoUrl : uri,
        mongoOptions : advancedOptions
    }),
    secret : 'thesession',
    resave : true,
    saveUninitialized : true
}

routerProductos.use(session(db))
routerCarritos.use(session(db))
const info = [
    {
        ruta: process.cwd(),
        id: process.pid,
        version: process.version,
        titulo: process.title,
        plataforma: process.platform,
    },
];
const memoria = [{ memoria: process.memoryUsage() }];

const argsDeEntrada = [args];

app.engine("handlebars", handlebars.engine());
app.set("views", "./public/views");
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
    logger.info('Esta en la ruta / por el metodo GET ')
    
    res.render("logIn");
});

app.get('/register', (req, res) => {
    logger.info('Esta en la ruta /register por el metodo GET ')
    res.render("register");
});
app.post('/register',async (req, res) => {
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
});


app.get("/api/random", (req, res) => {
    console.log(`Get randoms [${process.pid}]  PORT :${PORT}`)
    res.send('Random') // cluster
});

app.get("/info", (req, res) => {
    logger.info('Esta en la ruta /info por el metodo GET')
    res.render("info", {
        info_exist: info ? true : false,
        info,
        memoria,
        argsDeEntrada_exist: argsDeEntrada[0]._.length > 0 ? true : false,
        argsDeEntrada,
    });
});

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

routerProductos.get("/logout", (req, res) => {
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
});

routerProductos.post("/user", async (req, res) => {
    logger.info('Esta en la ruta /api/productos/user por el metodo POST')

    const user_mail = req.body.mail;
    const user_password = req.body.password;
    
    const usuario_db = await usuariosDao.getByMail(user_mail);
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
    
});

routerProductos.get("/", auth, async (req, res) => {
    logger.info('Esta en la ruta /api/productos/ por el metodo GET')
    // carga de productos
    const productos = await productosDao.getAll();
    res.render("home", {
        productos,
        productsExist: productos ? true : false,
        user :  req.session.user,
        admin : req.session.admin
    });
});

routerProductos.put("/", async (req, res) => {
    const codigo = req.body.codigo;
    // FORMS NO PEUDEN MANDAR PUTS NOSE COMO CAMBIAR
    logger.info('Esta en la ruta /api/productos/'+ codigo+' por el metodo PUT')
    console.log(codigo);
    
    const productoViejo = await productosDao.getByCodigo(id);    
    console.log(productoViejo);
    if(productoViejo){
        const producto = req.body
        console.log(producto)
        if(producto){
            await productosDao.update(producto)
            const productos = await productosDao.getAll();
            res.render("home", {
                productos,
                productsExist: productos ? true : false,
                admin : req.session.admin
            });
        }else{
            mensaje = "No hay nada que actualizar";
            logger.error(mensaje);
            errorType = "404";
            res.render("error", {
                errorType,
                mensaje,
                error: mensaje ? true : false,
            });
        }
    }else{
        mensaje = "No existe ese producto";
        logger.error(mensaje);
        errorType = "404";
        res.render("error", {
            errorType,
            mensaje,
            error: mensaje ? true : false,
        });
    }
});
routerProductos.get('/:id', auth, async (req,res) => {
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
})
routerProductos.get("/admin", async (req, res) => {
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
});
/*
routerProductos.get("/:id", async (req, res) => {
    const id = req.params.id;
    logger.info('Esta en la ruta /api/productos/'+id+' por el metodo GET')
    const producto = await productosDao.getByCodigo(id);
    if (producto) {
        res.render("home", {
            producto,
            productExist: producto ? true : false,
            admin : req.session.admin,
        });
    } else {
        mensaje = "No existe ese producto";
        logger.error(mensaje);
        errorType = "404";
        res.render("error", {
            errorType,
            mensaje,
            error: mensaje ? true : false,
        });
        // res.status(404).json(mensaje);
    }
});*/
routerProductos.post("/", auth, async (req, res) => {
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
});
routerCarritos.get('/', auth, async (req,res) => {
    const carrito = req.session.carrito
    console.log(carrito);
    res.render("carrito", {
        carrito,
        productos : carrito.productos,
        carritoExist: carrito.productos.length >= 1 ? true : false,
        user : req.session.user
    });
})
routerCarritos.get('/compra' , (req,res) => {
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
})


routerCarritos.get('/:codigo', auth, async (req,res) => {
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
})


