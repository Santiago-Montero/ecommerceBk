const configEnv = require("../config.js");

const twilio = require('twilio')

const accountSid = configEnv.AC_COUNTS_ID
const authToken = configEnv.AUTH_TOKEN

const client = twilio(accountSid, authToken)


module.exports ={ client }

