class ProductoDto {
    constructor(datos, cotizaciones) {
        this.nombre = datos.nombre
        this.precio = datos.precio
        for (const [ denominacion, valor ] of Object.entries(cotizaciones)) {
            this[ denominacion ] = valor
        }
    }
}

module.exports = ProductoDto