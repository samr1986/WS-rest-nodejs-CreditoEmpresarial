let mongoose = require('mongoose');
require('../models/database');
let Schema = mongoose.Schema;
let ExcepSubsaSchema = new Schema({
    FecIngresoEta: String,
    TipoOperacion: String,
    Modalidad: String,
    NroSolicitud: String,
    RegionalCCIAL: String,
    TamEmpresa: String,
    TipoID: String,
    ID: String,
    NomCliente: String,
    ValorSolicitado: String,
    ResultadoEtapa: String,
    HoraReporteEtapa: String,
    CodExcep: String,
    DesExcep: String,
    LeaEmpresa: String,
    TipoAbogado: String,
    CodRegional: String,
    ColaboradorResponsable: String
});
module.exports = mongoose.model('ExcepcionesSubsanables', ExcepSubsaSchema, 'ExcepcionesSubsanables')