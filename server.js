const { productosDao } = require("./contenedores/daos/index.js");
const { usuariosDao } = require("./contenedores/daos/index.js");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const moment = require("moment");
const handlebars = require("express-handlebars");
const app = express();
const { Router } = express;
const parseArgs = require("minimist");
const configEnv = require("./config.js");
const compression = require("compression");
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

const routerProductos = Router();

const args = parseArgs(process.argv.slice(2));

// console.log(args.modo)

// app.listen(args.port || 3000)
// pm2 start server.js --name="Server1" --watch -- 8081 FORK
// pm2 start server.js --name="Server2" --watch  -i max -- 8082 CLUSTER
const PORT = parseInt(process.argv[2]) || 8080; 
const MODE = process.argv[3] || 'CLUSTER'
app.listen( process.env.PORT || 8080);

routerProductos.use(express.static("./views/css"));
routerProductos.use(express.static("./views/js"));

app.use(compression());
app.use(express.json());
app.use("/api/productos/", routerProductos);

// para tomar los datos por body
routerProductos.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
routerProductos.use(
    express.urlencoded({
        extended: true,
    })
);
// para tomar los datos por body

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const uri = process.env.DB_URL_SESSION;
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

app.get('/mongo' , (req, res) => {
    if(req.session.views){
        req.session.views ++
        res.send('<h2> Views: ' + req.session.views + '</h2>')
    }else{
        req.session.views = 1;
        res.end('Bienvenido')
    }
})


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
app.set("views", "./views");
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
    // agregar validacion
    console.log(usuario);
    res.render("/");
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

let admin = false;

const auth = (req, res, next) => {
    if (req.session?.user) {
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

app.get("/logout", (req, res) => {
    logger.info('Esta en la ruta /logout por el metodo GET')
    req.session.destroy((error) => {
        if (error) {
            mensaje = "No existe ese producto";
            logger.error(mensaje);
            errorType = "404";
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
        // if(!req.session.user) req.session.user = usuario_db 
        if(usuario_db[0].nombre == "Santi"){
            admin = true;
            logger.trace('Bienvenido Admin')
        } 
        else admin = false;
        const productos = await productosDao.getAll();
        res.render("home", {
            productos,
            productsExist: productos ? true : false,
            user : usuario_db[0],
            admin
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
    console.log(productos);
    res.render("home", {
        productos,
        productsExist: productos ? true : false,
        user_name,
    });
});
routerProductos.get("/admin", async (req, res) => {
    logger.info('Esta en la ruta /api/productos/admin por el metodo GET')
    const productos = await productosDao.getAll();
    if (admin) {
        res.render("home", {
            productos,
            productExist: productos ? true : false,
            admin,
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
routerProductos.get("/:id", async (req, res) => {
    const id = req.params.id;
    logger.info('Esta en la ruta /api/productos/'+id+' por el metodo GET')
    const producto = await productosDao.getById(id);
    if (producto) {
        res.render("home", {
            producto,
            productExist: producto ? true : false,
            admin,
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
});
routerProductos.post("/", async (req, res) => {
    logger.info('Esta en la ruta /api/productos/ por el metodo POST')
    const { nombre, descripcion, stock, precio, foto } = req.body;
    const productoNuevo = {
        nombre,
        descripcion,
        stock,
        precio,
        foto,
        timestamp: moment().format("l"),
        codigo: Number(productosDao.getRandom()),
        id: productosDao.getId(),
    };
    if (await productosDao.save(productoNuevo)) {
        const productos = await productosDao.getAll();
        res.render("home", {
            productos,
            productsExist: productos ? true : false,
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
        // res.status(404).json(mensaje);
    }
});
routerProductos.put("/:id", async (req, res) => {
    const id = req.params.id;
    logger.info('Esta en la ruta /api/productos/'+ id+' por el metodo put')
    console.log(id);
    /*
      let productoViejo = await productosDao.getById(id)
      console.log(`SOY PRODUCTO VIEJO ${productoViejo}`)
      
      if(productoViejo){
          if(req.body){
              let { nombre, descripcion, stock, precio, foto} = req.body
              await productosDao.updateProducto(nombre, descripcion, stock, precio, foto, productoViejo)
              res.render('home') 
          }else{
              mensaje = {'error' :'no hay que actualizar'}
              res.json(mensaje)
          }
      }else{
          mensaje = { error: 'No existe ese producto' };
          res.status(404).json(mensaje);
      }*/
});
