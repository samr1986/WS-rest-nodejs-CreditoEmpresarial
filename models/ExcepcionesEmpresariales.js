let mongoose = require('mongoose');
require('../models/database');
let Schema = mongoose.Schema;
let ExcepEmpreSchema = new Schema({
    Codigo_Excepcion: String,
    Descripcion: String,
    Ind_Subsanable: String,
    Dias_Subsanar: String,
    Modo_Subsanar: String,
    Modo_SubAutom: String,
    TipoID: String,
    Desembolsable: String,
    Dias_Vigencia: String
});
module.exports = mongoose.model('ket010_excep_empr', ExcepEmpreSchema, 'ket010_excep_empr')