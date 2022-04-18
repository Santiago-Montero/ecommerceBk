const { graphqlHTTP } = require('express-graphql')
const { app } = require('./routes/routes.js')
const schemaProducto = require('./graphQl/schema/productos.schema')
const {
    getAll,
    createProducto
} = require('./graphQl/resolvers/productos.resolvers')
app.listen( process.env.PORT || 8080);


app.use('/graphql', graphqlHTTP({
    schema : schemaProducto,
    rootValue : {getAll, createProducto},
    graphiql : true

}))
