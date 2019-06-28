let mongoose = require('mongoose');
require('../models/database');
let Schema = mongoose.Schema;
let UsuColaboSchema = new Schema({
    identificacion: String,
    password: String
});
module.exports = mongoose.model('UsuariosColaboradores', UsuColaboSchema, 'UsuariosColaboradores')