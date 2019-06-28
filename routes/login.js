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
                UsuarioColaborador = mongoose.model('UsuariosColaboradores')
            } catch (error) {
                UsuarioColaborador = mongoose.model('UsuariosColaboradores', UsuColaboSchema, 'UsuariosColaboradores')
            };
            UsuarioColaborador
                .find({ identificacion: loginSchema.entrada.usuario })
            then(doc => {
                    loginSchema.salida.codigoRespuesta = 500;
                    loginSchema.salida.respuesta = 'Logueo incorrecto DATOS: ' + doc;
                    if (doc.password == loginSchema.entrada.password) {
                        loginSchema.salida.codigoRespuesta = 0;
                        loginSchema.salida.respuesta = 'Logueo satidfactorio DATOS: ' + doc;
                    }
                })
                .catch(err => {
                    loginSchema.salida.codigoRespuesta = 600;
                    loginSchema.salida.respuesta = 'consulta con error ' + err;
                });
            res.send(loginSchema);
        })
        .catch(err => {
            loginSchema.salida.codigoRespuesta = 200;
            loginSchema.salida.respuesta = 'no se pudo conectar ' + err;
            res.send(loginSchema);
        });
});


module.exports = router;