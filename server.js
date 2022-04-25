const { app } = require('./routes/routes.js')
const koaApp = require('./framework/koa.app.js')


koaApp.listen(3000)
//app.listen( process.env.PORT || 8080);

