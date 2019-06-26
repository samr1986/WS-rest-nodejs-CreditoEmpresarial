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
        codigoRespuesta: 100,
        respuesta: 'cargue inicial',
    }
};

router.get('/', function(req, res, next) {
    loginSchema.entrada.usuario = req.query.usuario;
    loginSchema.entrada.password = req.query.password;
    mongoose.connection.on('error', function() {
        loginSchema.salida.codigoRespuesta = 400;
        loginSchema.salida.respuesta = 'error conectandose a cosmos db ';
    });
    mongoose.connection.once('open', function() {
        let coleccion = mongoose.connection.db.collection("UsuariosColaboradores");
        coleccion.find({ 'identificacion': loginSchema.entrada.usuario }).toArray(function(err, data) {
            loginSchema.salida.codigoRespuesta = 500;
            loginSchema.salida.respuesta = 'Logueo incorrecto';
            if (err) {
                loginSchema.salida.codigoRespuesta = 600;
                loginSchema.salida.respuesta = 'consulta con error';
            }
            if (data) {
                loginSchema.salida.codigoRespuesta = 0;
                loginSchema.salida.respuesta = ' consulta hecha ' + JSON.stringify(data);

            }
            /*if (data.length == 1) {
                if (data[0].password == loginSchema.entrada.password) {
                    loginSchema.salida.codigoRespuesta = 0;
                    loginSchema.salida.respuesta = loginSchema.salida.respuesta + ' Logueo existoso';
                    //mongoose.connection.close();
                }
            }*/
        });
    });
    mongoose.connect(process.env.COSMOSDB_CONNSTR + "?ssl=true&replicaSet=globaldb", {
            auth: {
                user: process.env.COSMODDB_USER,
                password: process.env.COSMOSDB_PASSWORD
            }
        })
        .then(() => {
            loginSchema.salida.respuesta = 'conexion exitosa ';
            res.send(loginSchema);
        })
        .catch((err) => {
            loginSchema.salida.codigoRespuesta = 200;
            loginSchema.salida.respuesta = 'conexion no establecida ' + err;
            res.send(loginSchema);
        });
});

module.exports = router;