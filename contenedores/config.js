module.exports = {
    mongodb: {
        url: process.env.DB_URL || "mongodb+srv://santi:santi@cluster0.j0w00.mongodb.net/ecommerce?retryWrites=true&w=majority",
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    },
}