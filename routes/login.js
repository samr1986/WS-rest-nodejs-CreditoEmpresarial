var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var env = require('dotenv').config();

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
    mongoose.connection.on('error', function() {
        loginSchema.salida.codigoRespuesta = 400;
        loginSchema.salida.respuesta = 'error conectandose a cosmos db ';
    });
    mongoose.connection.once('open', function() {
        loginSchema.salida.respuesta = loginSchema.salida.respuesta + ' Entro al open ';
        let coleccion = mongoose.connection.db.collection("UsuariosColaboradores");
        coleccion.find({ 'identificacion': loginSchema.entrada.usuario })
            .then(() => {
                loginSchema.salida.respuesta = loginSchema.salida.respuesta + ' se supone consulta exitosa ';
            })
            .catch((err) => {
                loginSchema.salida.respuesta = loginSchema.salida.respuesta + ' error consulta ' + err;
            });

        loginSchema.salida.respuesta = loginSchema.salida.respuesta + ' ' + coleccion.namespace;
    });
    mongoose.connect(process.env.COSMOSDB_CONNSTR + "?ssl=true&replicaSet=globaldb", {
            auth: {
                user: process.env.COSMODDB_USER,
                password: process.env.COSMOSDB_PASSWORD
            }
        })
        .then(() => {
            loginSchema.salida.respuesta = loginSchema.salida.respuesta + ' conexion exitosa ';
            res.send(loginSchema);
        })
        .catch((err) => {
            loginSchema.salida.codigoRespuesta = 200;
            loginSchema.salida.respuesta = 'conexion no establecida ' + err;
            res.send(loginSchema);
        });
});

module.exports = router;