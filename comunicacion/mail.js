const { createTransport } = require('nodemailer')

const mail = 'santimonter200123@gmail.com'
//mjybrqzqnthplpuh
const transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: mail,
        pass: 'mjybrqzqnthplpuh'
    }
});

module.exports ={ transporter }


