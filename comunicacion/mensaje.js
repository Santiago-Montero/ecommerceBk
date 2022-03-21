const configEnv = require("../config.js");

const twilio = require('twilio')

const accountSid = configEnv.AC_COUNTS_ID
const authToken = configEnv.AUTH_TOKEN

console.log(accountSid);
console.log(authToken);

const client = twilio(accountSid, authToken)


module.exports ={ client }

