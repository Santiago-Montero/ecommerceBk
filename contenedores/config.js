module.exports = {
    mongodb: {
        url: 'mongodb://'+process.env.PORT || 8080+'/ecommerceBk',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    },
}