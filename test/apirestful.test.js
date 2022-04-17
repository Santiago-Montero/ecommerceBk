const request = require('supertest')('http://localhost:8080')
const expect = require('chai').expect


describe('test api rest full', () => {
    it('deberia retornar un array de 2 elementos', async () => {
        let response = await request.get('/test/productos')
        console.log(response._body)
        expect(response._body.length).to.eql(6) 
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