const configEnv = require("../config.js");

const { createTransport } = require('nodemailer')

const mail = configEnv.MAIL_ADMIN
//mjybrqzqnthplpuh
const transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: mail,
        pass: configEnv.PASS_EMAILER
    }
});

module.exports ={ transporter }


