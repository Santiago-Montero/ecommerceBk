const configEnv = require("../config.js");

const twilio = require('twilio')

const accountSid = configEnv.ACCOUNTS_ID
const authToken = configEnv.ACCOUNTS_ID

const client = twilio(accountSid, authToken)


module.exports ={ client }

