const Koa = require('koa')
const koaBody = require('koa-body');

const appKoa = new Koa();

let products = require('./productsKoa.js')


appKoa.use(koaBody())
appKoa.use(products.routes())

module.exports = appKoa