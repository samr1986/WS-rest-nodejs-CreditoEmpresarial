var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
router.get('/', function(req, res, next) {
    let UtilizacionesSchema = {
        entrada: {
            TipoOperacion: '',
            NumeroSolicitud: '',
            Modalidad: ''
        },
        salida: {
            codigoRespuesta: 100,
            respuesta: 'cargue inicial',
            Utilizaciones: []
        }
    };
    UtilizacionesSchema.entrada.TipoOperacion = req.query.TipoOperacion;
    UtilizacionesSchema.entrada.NumeroSolicitud = req.query.NumeroSolicitud;
    UtilizacionesSchema.entrada.Modalidad = req.query.Modalidad;
    let Utilizaciones = require('../models/Utilizaciones');
    if (mongoose.connection.readyState == 1) {
        Utilizaciones
            .find({
                Kl60_Tipo_Operacion: req.query.TipoOperacion,
                Ki60_Numero_Credito_Tot: req.query.NumeroSolicitud,
                Kl60_modalidad: req.query.Modalidad
            })
            .then(doc => {
                UtilizacionesSchema.salida.codigoRespuesta = 300;
                UtilizacionesSchema.salida.respuesta = 'no exiten registros la utilizacion';
                if (doc.length >= 1) {
                    UtilizacionesSchema.salida.codigoRespuesta = 0;
                    UtilizacionesSchema.salida.respuesta = 'transaccion exitosa';
                    UtilizacionesSchema.salida.Utilizaciones = doc;
                }
                res.send(UtilizacionesSchema);
            })
            .catch(err => {
                UtilizacionesSchema.salida.codigoRespuesta = 400;
                UtilizacionesSchema.salida.respuesta = 'consulta con error ' + err;
                res.send(UtilizacionesSchema);
            });
    } else {
        UtilizacionesSchema.salida.codigoRespuesta = 200;
        UtilizacionesSchema.salida.respuesta = 'no hay conexion con cosmos db ' + mongoose.connection.readyState;
        res.send(UtilizacionesSchema);
    }
});


module.exports = router;