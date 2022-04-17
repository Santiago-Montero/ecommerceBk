const { client } = require('../comunicacion/mensaje')
const {
    getProduct,
    getProducts,
    postCart } = require('../services/services')


/* CARRITO */

async function getCompra(req, res) {
    const codigo = req.params.codigo
    const carrito = req.session.carrito
    const productoAgregado = await getProduct(codigo);
    if (productoAgregado) carrito.productos.push(productoAgregado)
    const carritoAgregado = await postCart(carrito)
    console.log(carritoAgregado);
    const productos = await getProducts();
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

module.exports  = { 
    getCarrito,
    getCompraCarrito,
    getCompra,
}