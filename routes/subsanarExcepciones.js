let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

router.get('/', function(req, res, next) {
    let SubsanarExcepcionesSchema = {
        entrada: {
            colaboradorResponsable: ''
        },
        salida: {
            codigoRespuesta: 100,
            respuesta: 'cargue inicial',
            ExcepcionesSubsables: []
        }
    };
    SubsanarExcepcionesSchema.entrada.colaboradorResponsable = req.query.colaboradorResponsable;
    let ExcepcionesSubsanables = require('../models/ExcepcionesSubsanables');
    if (mongoose.connection.readyState == 1) {
        ExcepcionesSubsanables
            .find({ ColaboradorResponsable: req.query.colaboradorResponsable })
            .then(doc => {
                SubsanarExcepcionesSchema.salida.codigoRespuesta = 300;
                SubsanarExcepcionesSchema.salida.respuesta = 'no exiten registros para el colaborador';
                if (doc.length >= 1) {
                    SubsanarExcepcionesSchema.salida.codigoRespuesta = 0;
                    SubsanarExcepcionesSchema.salida.respuesta = 'transaccion exitosa';
                    SubsanarExcepcionesSchema.salida.ExcepcionesSubsables = doc;
                }
                res.send(SubsanarExcepcionesSchema);
            })
            .catch(err => {
                SubsanarExcepcionesSchema.salida.codigoRespuesta = 400;
                SubsanarExcepcionesSchema.salida.respuesta = 'consulta con error ' + err;
                res.send(SubsanarExcepcionesSchema);
            });
    } else {
        SubsanarExcepcionesSchema.salida.codigoRespuesta = 200;
        SubsanarExcepcionesSchema.salida.respuesta = 'no hay conexion con cosmos db ' + mongoose.connection.readyState;
        res.send(SubsanarExcepcionesSchema);
    }
});

module.exports = router;