let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let db = require('../database');
let UsuColaboSchema = new Schema({
    identificacion: String,
    password: String
});
module.exports = mongoose.model('UsuariosColaboradores', UsuColaboSchema, 'UsuariosColaboradores')