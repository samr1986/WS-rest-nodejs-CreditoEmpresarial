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
    res.send(loginSchema)

});

module.exports = router;