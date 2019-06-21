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
    let resultadoConexion = false,
        errorConeccion;
    mongoose.connect(process.env.COSMOSDB_CONNSTR + "?ssl=true&replicaSet=globaldb", {
            auth: {
                user: process.env.COSMODDB_USER,
                password: process.env.COSMOSDB_PASSWORD
            }
        })
        .then(() => resultadoConexion = true)
        .catch((err) => errorConeccion = err);
    if (resultadoConexion) {
        loginSchema.cogigoRespuesta = 0;
        loginSchema.respuesta = 'conexion establecida con exito';
    } else {
        loginSchema.cogigoRespuesta = 200;
        loginSchema.respuesta = 'conexion no establecida ' + errorConeccion;
    }
    res.send(loginSchema)

});

module.exports = router;