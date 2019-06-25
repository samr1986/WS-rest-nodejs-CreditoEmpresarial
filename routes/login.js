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
            codigoRespuesta: 200,
            respuesta: '',
        }
    };
    loginSchema.entrada.usuario = req.query.usuario;
    loginSchema.entrada.password = req.query.password;
    mongoose.set('bufferCommands', false);
    mongoose.connect(process.env.COSMOSDB_CONNSTR + "?ssl=true&replicaSet=globaldb", {
            auth: {
                user: process.env.COSMODDB_USER,
                password: process.env.COSMOSDB_PASSWORD
            }
        })
        .then(() => {})
        .catch((err) => {
            loginSchema.salida.codigoRespuesta = 200;
            loginSchema.salida.respuesta = 'conexion no establecida ' + err;
        });
    let conexion = mongoose.connection;
    mongoose.connection.on('error', function() {
        loginSchema.salida.codigoRespuesta = 400;
        loginSchema.salida.respuesta = 'error conectandose a cosmos db ';
    });
    mongoose.connection.on('open', function() {
        mongoose.connection.db.collection("UsuariosColaboradores", function(err, collection) {
            collection.find({ 'identificacion': loginSchema.entrada.usuario }).toArray(function(err, data) {
                loginSchema.salida.codigoRespuesta = 500;
                loginSchema.salida.respuesta = 'Logueo incorrecto';
                if (data.length == 1) {
                    if (data[0].password == loginSchema.entrada.password) {
                        loginSchema.salida.codigoRespuesta = 0;
                        loginSchema.salida.respuesta = 'Logueo existoso';
                    }

                }
            })
        });

    });
    mongoose.connection.close();
    res.send(loginSchema);
});

module.exports = router;