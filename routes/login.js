var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
var env = require('dotenv').config();
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
    mongoose.connect(process.env.COSMOSDB_CONNSTR + "?ssl=true&replicaSet=globaldb", {
            auth: {
                user: process.env.COSMODDB_USER,
                password: process.env.COSMOSDB_PASSWORD
            }
        })
        .then(() => {

            loginSchema.entrada.usuario = req.query.usuario;
            loginSchema.entrada.password = req.query.password;
            var cache = [];
            let Schema = mongoose.Schema;
            let UsuColaboSchema = new Schema({
                identificacion: String,
                password: String
            });
            let UsuarioColaborador
            try {
                UsuarioColaborador = mongoose.model('users')
            } catch (error) {
                UsuarioColaborador = mongoose.model('UsuariosColaboradores', UsuColaboSchema)
            };
            UsuarioColaborador
                .find({
                    identificacion: req.query.usuario
                })
                .then(doc => {
                    loginSchema.salida.codigoRespuesta = 500;
                    loginSchema.salida.respuesta = 'Logueo incorrecto DATOS: ' +
                        JSON.stringify(doc, function(key, value) {
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
                    res.send(loginSchema);
                })
                .catch(err => {
                    loginSchema.salida.codigoRespuesta = 600;
                    loginSchema.salida.respuesta = 'consulta con error ' + err;
                    res.send(loginSchema);
                });
        })
        .catch(err => {
            loginSchema.salida.codigoRespuesta = 200;
            loginSchema.salida.respuesta = 'no se pudo conectar ' + err;
            res.send(loginSchema);
        });
    /*var cache = [];
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
    res.send(loginSchema);*/
});


module.exports = router;