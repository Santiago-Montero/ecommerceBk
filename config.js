require('dotenv').config()

module.exports = {
    NODE_ENV : process.env.NODE_ENV || 'development',
    HOST : process.env.HOST || '127.0.0.1',
    DB_URL : process.env.DB_URL || 'mongodb+srv://santi:santi@cluster0.j0w00.mongodb.net/ecommerce?retryWrites=true&w=majority',
    DB_URL_SESSION : process.env.DB_URL_SESSION || 'mongodb+srv://santi:santi@cluster0.j0w00.mongodb.net/sessions?retryWrites=true&w=majority',
    MAIL_ADMIN:  process.env.MAIL_ADMIN,
    WPP_ADMIN: process.env.WPP_ADMIN 
    // PORT : process.env.PORT || 3000
}