require('dotenv').config()


const fondo = process.env.FONDO 
console.log(fondo)

module.exports = {
    NODE_ENV : process.env.NODE_ENV || 'development',
    HOST : process.env.HOST || '127.0.0.1',
    DB_URL : 'mongodb+srv://santi:santi@cluster0.j0w00.mongodb.net/ecommerce?retryWrites=true&w=majority',
    DB_URL_SESSION : 'mongodb+srv://santi:santi@cluster0.j0w00.mongodb.net/sessions?retryWrites=true&w=majority'
    // PORT : process.env.PORT || 3000
}