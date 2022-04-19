const request = require('supertest')('http://localhost:8080')
const expect = require('chai').expect
const app = require('../server')

describe('test api rest full', () => {
    it('deberia retornar un array de elementos', async () => {
        let response = await request.get('/test/productos')
        expect(response._body).to.be.an('array') 
    })
    it('deberia retornar un estado 200', async () => {
        const producto = {
            nombre : 'Mac',
            descripcion : 'adasadsa',
            stock : 50,
            precio : 4000,
            foto : 'dasd',
        }
        let response = await request.post('/test/productos').send(producto)
        expect(response.status).to.eql(200) 
    })
})