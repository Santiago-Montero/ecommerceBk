const configEnv = require("../config.js");

module.exports = {
    mongodb: {
        url: configEnv.DB_URL,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    },
}