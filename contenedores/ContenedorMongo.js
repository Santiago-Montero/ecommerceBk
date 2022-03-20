const mongoose = require('mongoose')
const config = require('./config')

// import mongoose from 'mongoose'
// import config from '../config.js'

mongoose.connect(config.mongodb.url, config.mongodb.options) //lo comento porque lo subo a la nube

class ContenedorMongoDb {

    constructor(nombreColeccion, esquema) {
        this.coleccion = mongoose.model(nombreColeccion, esquema)
    }
    getRandom(){
        return Math.floor(Math.random() * (999999 - 1000)) + 1000;
    }
    async getById(id) {
        try {
            const docs = await this.coleccion.find({ '_id': id }).lean()
            if (docs.length >= 1) {
                return docs[0]
            }
        } catch (err) {
            console.log(err)
        }
    }
    async getByRandom(id) {
        try {
            const docs = await this.coleccion.find({ 'codigo': id }).lean()
            if (docs.length >= 1) {
                return docs[0]
            }
        } catch (err) {
            console.log(err)
        }
    }
    async getAll() {
        try {
            const docs = await this.coleccion.find({}).lean()
            return docs
        } catch (err) {
            console.log(err)
        }
    }

    async save(elemento) {
        try {
            const doc = await this.coleccion.create(elemento);
            return doc
        } catch (err) {
            console.log(err)
        }
    }

    async update(elemento) {
        try {
            const { n, nModified } = await this.coleccion.replaceOne({ 'codigo' : elemento.codigo }, elemento)
            if (n == 0 || nModified == 0) {
                console.log('No se pudo actualizar no se encontro el elemento')
            } else {
                console.log('Se actualizo')
            }
        } catch (err) {
            console.log(err)
        }
    }

    async deleteById(id) {
        try {
            await this.coleccion.deleteOne({ '_id': id })
        } catch (err) {
            console.log(err)
        }
    }

    async deleteAll() {
        try {
            await this.coleccion.deleteMany({})
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = ContenedorMongoDb