const { productosDao } = require('./contenedores/daos/index.js')
const express = require('express') ;
const session = require('express-session')
const MongoStore = require('connect-mongo')
const moment = require('moment')
const handlebars = require('express-handlebars')
const app  = express() ; 
const { Router } = express

app.listen(3000)
const routerProductos = Router();

routerProductos.use(express.static('./views/css'));
routerProductos.use(express.static('./views/js'));

app.use("/api/productos/", routerProductos) ;

// para tomar los datos por body 
routerProductos.use(express.json());

routerProductos.use(express.urlencoded({
    extended: true
}));
// para tomar los datos por body 

// MONGO 
/*
app.use(session({
    store : new MongoStore({
        mongoUrl: 'mongodb://localhost/sessions'
    }),
    secret : 'thesession',
    resave : false,
    saveUninitialized : false
}))*/

// MONGO ATLAS
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }
const uri = "mongodb+srv://santi:santi@cluster0.j0w00.mongodb.net/sessions?retryWrites=true&w=majority";

app.use(session({
    store : new MongoStore({
        mongoUrl : uri,
        mongoOptions : advancedOptions
    }),
    secret : 'thesession',
    resave : true,
    saveUninitialized : true,
    cookie : {
        maxAge : 40000
    }
}))

routerProductos.use(session({
    store : new MongoStore({
        mongoUrl : uri,
        mongoOptions : advancedOptions
    }),
    secret : 'thesession',
    resave : true,
    saveUninitialized : true,
    cookie : {
        maxAge : 40000
    }
}))/*
app.get('/mongo' , (req, res) => {
    if(req.session.views){
        req.session.views ++
        res.send('<h2> Views: ' + req.session.views + '</h2>')
    }else{
        req.session.views = 1;
        res.end('Bienvenido')
    }
})*/


app.engine(
    "handlebars",
    handlebars.engine()
);
app.set('views', './views');
app.set('view engine','handlebars');

app.get('/' , async (req,res) => {
    // let productos = await productosDao.getAll()
    // console.log(productos)
    // INICIO DE SESION   
    if(req.session.user) req.session.user = ''
    res.render('logIn') ;
})
let admin = false ; 
app.get('/logout',(req, res) => {
    req.session.destroy(error => {
        if(error){
                mensaje = 'No existe ese producto' ;
                errorType = '404' ; 
                res.render('error', {
                errorType,
                mensaje,
                error : mensaje ? true : false
            }) 
        }
        else res.render('logIn') ;
    })
})
routerProductos.get('/', async (req, res) => {
    const user_name = req.query
    if(user_name == 'santi') admin = true
    else admin = false
    // req.session.user =  req.session.user ? user_name  : user_name 
    req.session.user = user_name
    // carga de productos
    const productos = await productosDao.getAll()
    console.log(productos)
    if(user_name.nombre){
        res.render('home', {
            productos,
            productsExist : productos ? true : false,
            user_name
        }) 
    }else{
        mensaje = 'Ingresa Para poder ver los productos' ;
        errorType = '404' ; 
        res.render('error', {
        errorType,
        mensaje,
        error : mensaje ? true : false
        })
    }
});
routerProductos.get('/admin', async (req, res) => {
    const productos = await productosDao.getAll()
    if(admin){
        res.render('home', {
            productos,
            productExist : productos ? true : false,
            admin
        }) 
    }else{
        mensaje = 'No tiene permiso para estar aca' ;
        errorType = '404' ; 
        res.render('error', {
            errorType,
            mensaje,
            error : mensaje ? true : false
        }) 
        // res.status(404).json(mensaje);
    }
});
routerProductos.get('/:id', async (req, res) => {
    const id = req.params.id
    const producto  = await productosDao.getById(id)
    if(producto){
        res.render('home', {
            producto,
            productExist : producto ? true : false,
            admin
        }) 
    }else{
        mensaje = 'No existe ese producto' ;
        errorType = '404' ; 
        res.render('error', {
            errorType,
            mensaje,
            error : mensaje ? true : false
        }) 
        // res.status(404).json(mensaje);
    }
});
routerProductos.post('/', async (req, res) => {
    const { nombre, descripcion, stock, precio, foto } = req.body
    const productoNuevo = {
        nombre,
        descripcion,
        stock,
        precio,
        foto,
        timestamp: moment().format('l'),
        codigo: Number(productosDao.getRandom()),
        id : productosDao.getId()
    }
    if(await productosDao.save(productoNuevo)){
        const productos = await productosDao.getAll()
        res.render('home', {
            productos,
            productsExist : productos ? true : false
        })
    }else{
        mensaje = 'No se pudo crear el producto' ;
        errorType = '500' ; 
        res.render('error', {
            errorType,
            mensaje,
            error : mensaje ? true : false
        }) 
        // res.status(404).json(mensaje);
    }
    
});
routerProductos.put('/:id', async (req, res) => {
    const id = req.params.id
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