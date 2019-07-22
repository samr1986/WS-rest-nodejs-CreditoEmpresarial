let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

router.get('/', function(req, res, next) {
    let ExcepcionesEmpresarialesSchema = {
        entrada: {
            colaboradorResponsable: ''
        },
        salida: {
            codigoRespuesta: 100,
            respuesta: 'cargue inicial',
            ExcepcionesEmpresariales: []
        }
    };
    let ExcepcionesEmpresariales = require('../models/ExcepcionesEmpresariales');
    if (mongoose.connection.readyState == 1) {
        ExcepcionesEmpresariales
            .find({})
            .then(doc => {
                ExcepcionesEmpresarialesSchema.salida.codigoRespuesta = 0;
                ExcepcionesEmpresarialesSchema.salida.respuesta = 'transaccion exitosa';
                ExcepcionesEmpresarialesSchema.salida.ExcepcionesEmpresariales = doc;
                res.send(ExcepcionesEmpresarialesSchema);
            })
            .catch(err => {
                ExcepcionesEmpresarialesSchema.salida.codigoRespuesta = 400;
                ExcepcionesEmpresarialesSchema.salida.respuesta = 'consulta con error ' + err;
                res.send(ExcepcionesEmpresarialesSchema);
            });
    } else {
        ExcepcionesEmpresarialesSchema.salida.codigoRespuesta = 200;
        ExcepcionesEmpresarialesSchema.salida.respuesta = 'no hay conexion con cosmos db ' + mongoose.connection.readyState;
        res.send(ExcepcionesEmpresarialesSchema);
    }
});

module.exports = router;