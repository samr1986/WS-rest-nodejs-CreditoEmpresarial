var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
router.get('/', function(req, res, next) {
    let loginSchema = {
        entrada: {
            usuario: '',
            password: ''
        },
        salida: {
            codigoRespuesta: 100,
            respuesta: 'cargue inicial',
        }
    };
    loginSchema.entrada.usuario = req.query.usuario;
    loginSchema.entrada.password = req.query.password;
    let UsuarioColaborador = require('../models/UsuariosColaboradores');
    UsuarioColaborador
        .find({ identificacion: loginSchema.entrada.usuario })
        .then(doc => {
            loginSchema.salida.codigoRespuesta = 500;
            loginSchema.salida.respuesta = 'Logueo incorrecto DATOS: ' + doc;
            if (doc.length == 1) {
                if (doc[0].password == loginSchema.entrada.password) {
                    loginSchema.salida.codigoRespuesta = 0;
                    loginSchema.salida.respuesta = 'Logueo satidfactorio DATOS: ' + doc;
                }
            }
            loginSchema.salida.respuesta = loginSchema.salida.respuesta + ' estado ' + mongoose.connection.readyState
            res.send(loginSchema);
        })
        .catch(err => {
            loginSchema.salida.codigoRespuesta = 600;
            loginSchema.salida.respuesta = 'consulta con error ' + err;
            loginSchema.salida.respuesta = loginSchema.salida.respuesta + ' estado ' + mongoose.connection.readyState
            res.send(loginSchema);
        });
});


module.exports = router;