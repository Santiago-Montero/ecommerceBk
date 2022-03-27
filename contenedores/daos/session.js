const configEnv = require("../../config");
const MongoStore = require("connect-mongo");

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const uri = configEnv.DB_URL_SESSION;
const db = {
    store : new MongoStore({
        mongoUrl : uri,
        mongoOptions : advancedOptions
    }),
    secret : 'thesession',
    resave : true,
    saveUninitialized : true
}

module.exports = { db }