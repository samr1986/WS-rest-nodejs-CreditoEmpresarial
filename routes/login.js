var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var env = require('dotenv').config();

let loginSchema = {
    entrada: {
        usuario: '',
        password: ''
    },
    salida: {
        cogigoRespuesta: 200,
        respuesta: '',
    }
};

router.get('/', function(req, res, next) {
    loginSchema.entrada.usuario = req.query.usuario;
    loginSchema.entrada.password = req.query.password;
    mongoose.connect(process.env.COSMOSDB_CONNSTR + "?ssl=true&replicaSet=globaldb", {
            auth: {
                user: process.env.COSMODDB_USER,
                password: process.env.COSMOSDB_PASSWORD
            }
        })
        .then(() => {
            loginSchema.salida.cogigoRespuesta = 0;
            loginSchema.salida.respuesta = 'conexion establecida con exito';
        })
        .catch((err) => {
            loginSchema.salida.cogigoRespuesta = 200;
            loginSchema.salida.respuesta = 'conexion no establecida ' + err;
        });
    let conexion = mongoose.connection;
    conexion.on('error', function() {
        loginSchema.salida.cogigoRespuesta = 400;
        loginSchema.salida.respuesta = 'error conectandose a cosmos db ';
    });
    conexion.once('open', function() {
        conexion.db.collection("UsuariosColaboradores", function(err, collection) {
            collection.find({ 'identificacion': loginSchema.entrada.usuario }).toArray(function(err, data) {
                loginSchema.salida.cogigoRespuesta = 500;
                loginSchema.salida.respuesta = 'Logueo incorrecto';
                if (data.length == 1) {
                    if (data[0].password == loginSchema.entrada.password) {
                        loginSchema.salida.cogigoRespuesta = 0;
                        loginSchema.salida.respuesta = 'Logueo existoso';
                    }

                }
            })
        });

    });
    res.send(loginSchema);
});

module.exports = router;