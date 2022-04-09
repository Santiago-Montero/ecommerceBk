const ContenedorMongoDb = require("../../ContenedorMongo")
const ProductoDto = require('../../dto/productoDto')
const Cotizador = require('../../dto/cotizador')
class ProductosDaoMongoDb extends ContenedorMongoDb {

    constructor() {
        super('productos', {
            nombre: { type: String, required: true },
            precio: { type: Number, required: true },
            descripcion: { type: String, required: true },
            foto: { type: String, required: true },
            stock: { type: Number, required: true },
            timestamp: { type: Date, required: true },
            codigo: { type: Number, required: true }
        })
        this.cotizador = new Cotizador()
    }
    async buscarConCotizacionEnDolares(id) {
        if (id) {
            const producto = await  this.getById(id);
            const cotizaciones = {
                precioDolar: this.cotizador
                    .getPrecioSegunMoneda(producto.precio, 'USD')
            }
            const productoDto = new ProductoDto(producto, cotizaciones)
            return productoDto
        } else {
            const productos = await this.getAll();
            const productosDtos = productos.map(producto => {
                const cotizaciones = {
                    precioDolar: this.cotizador
                        .getPrecioSegunMoneda(producto.precio, 'USD')
                }
                const productoDto = new ProductoDto(producto, cotizaciones)
                return productoDto
            })
            return productosDtos;
        }
    }
}

module.exports = ProductosDaoMongoDb;