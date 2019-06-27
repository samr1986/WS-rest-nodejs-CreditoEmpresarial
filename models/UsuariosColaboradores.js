let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UsuColaboSchema = new Schema({
    identificacion: String,
    password: String
});
module.exports = mongoose.model('UsuariosColaboradore', UsuColaboSchema);