const Router = require("koa-router");
const {
    getProductoKoa,
    getProductosKoa,
} = require('../controllers/controllerProducto')

const router = new Router({
    prefix: "/koa",
});




/* API REST Get All */
router.get("/", async (ctx) => {
    const products = await getProductosKoa()
    ctx.body = {
        status: "success",
        message: products,
    };
});

/* API REST Get x ID */
router.get("/:id",async  (ctx) => {
    const product = await getProductoKoa(ctx.params.id)
    if (product) {
        ctx.body = product;
    } else {
        ctx.response.status = 404;
        ctx.body = {
            status: "error!",
            message: "Product Not Found with that id!",
        };
    }
});

module.exports = router;