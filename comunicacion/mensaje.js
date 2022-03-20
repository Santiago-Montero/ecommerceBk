const twilio = require('twilio')

const accountSid = 'AC87691f170bf51dd27127a6af34589b9f'
const authToken = 'f5353f8a127a984549c1c2926c192ba5'

const client = twilio(accountSid, authToken)


module.exports ={ client }

