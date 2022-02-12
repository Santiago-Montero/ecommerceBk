const { fork } = require('child_process')
const http  = require('http')


const server = http.createServer()

const randoms = () => {
    return Math.random() * (1000 - 1) + 1
}

server.on('request' , (req,res) => {
    let { url } = req

    if( url == '/api/randoms'){
        // const random = randoms()
        // res.end('Numero random '+ random)
        const computo = fork('./random.js')
        computo.send('start')
        computo.on('message', random => {
            res.end('Numero random '+ random)
        })
        // console.log('hola');
    }
})

server.listen(3000)

