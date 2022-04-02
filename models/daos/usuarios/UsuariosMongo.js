const ContenedorMongoDb = require("../../ContenedorMongo")

class UsuariosDaoMongoDb extends ContenedorMongoDb {

    constructor() {
        super('usuarios', {
            nombre: { type: String, required: true },
            edad: { type: Number, required: true },
            telefono: { type: Number, required: true },
            mail: { type: String, required: true },
            direccion: { type: String, required: true },
            password: { type: String, required: true },
            foto: { type: String, required: true },
        })
    }
    async getByMail(mail) {
        try {
            const docs = await this.coleccion.find({ 'mail': mail }).lean()
            if (docs.length == 0) {
                console.log('No se encontro ese mail')
                return null
            } else {
                return docs
            }
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = UsuariosDaoMongoDb;