var express = require('express');
var router = express.Router();
var env = require('dotenv').config();
var UsuarioColaborador = require('../models/UsuariosColaboradores');
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
router.get('/', function(req, res, next) {
    loginSchema.entrada.usuario = req.query.usuario;
    loginSchema.entrada.password = req.query.password;
    /*UsuarioColaborador
        .find({
            identificacion: req.query.usuario
        })
        .then(doc => {
            loginSchema.salida.codigoRespuesta = 500;
            loginSchema.salida.respuesta = 'Logueo incorrecto DATOS: ' + doc.length;
            res.send(loginSchema);
        })
        .catch(err => {
            loginSchema.salida.codigoRespuesta = 600;
            loginSchema.salida.respuesta = 'consulta con error ' + err;
            res.send(loginSchema);
        });*/
    var cache = [];
    loginSchema.salida.codigoRespuesta = 500;
    loginSchema.salida.respuesta = 'que tiene usuariocola: ' +

        JSON.stringify(UsuarioColaborador.db, function(key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    // Duplicate reference found, discard key
                    return;
                }
                // Store value in our collection
                cache.push(value);
            }
            return value;
        });
    cache = null;
    res.send(loginSchema);
});


module.exports = router;