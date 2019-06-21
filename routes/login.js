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
    let creditoEmpresar = mongoose.connect(process.env.COSMOSDB_CONNSTR + "?ssl=true&replicaSet=globaldb", {
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
    if (loginSchema.salida.cogigoRespuesta == 0) {
        let usersSchema = new mongoose.Schema({
            _id: mongoose.Schema.Types.ObjectId,
            identificacion: String,
            password: String
        })
        let users = creditoEmpresar.model('Login', usersSchema, 'UsuariosColaboradores')
        users.find({}).exec(function(err, users) {
            if (err) {
                loginSchema.salida.cogigoRespuesta = 400;
                loginSchema.salida.respuesta = 'error consultando (find) ' + err;
            } else {
                loginSchema.salida.cogigoRespuesta = 0;
                loginSchema.salida.respuesta = JSON.stringify(users);
            }
        });
    }
    res.send(loginSchema)

});

module.exports = router;