
const { buildSchema } = require('graphql')

const schema = buildSchema(`
    type Producto {
        id: ID!
        nombre: String
        precio: Int
    }
    type ProductoInput {
        nombre: String
        precio: Int
    }
    type Query {
        getAll: [Producto],
    }
    type Mutation {
        createProducto(data : ProductoInput): Producto,
    }
`)

module.exports = schema