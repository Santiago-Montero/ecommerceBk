const request = require('supertest')('http://localhost:8080')
const expect = require('chai').expect
const { productosDao } = require("../models/daos/index.js");


describe('test api rest full', () => {
    it('deberia retornar un array de 2 elementos', async () => {
        let response = await request.get('/api/productos/productos')
        expect(response._body.length).to.eql(2) 
    })
    it('deberia retornar un estado 200', async () => {
        const producto = {
            nombre : 'Mac',
            descripcion : 'adasadsa',
            stock : 50,
            precio : 4000,
            foto : 'dasd',
        }
        let response = await request.post('/api/productos/productos').send(producto)
        expect(response.status).to.eql(200) 
    })
})