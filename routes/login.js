var express = require('express');
var router = express.Router();
var env = require('dotenv').config();
var mongoose = require('mongoose');
let Schema = mongoose.Schema;
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

var UsuColaboSchema = new Schema({
    _id: {
        type: Schema.ObjectId,
        ref: 'id'
    },
    identificacion: {
        type: String,
        default: '',
        trim: true
    },
    password: {
        type: String,
        default: '',
        trim: true
    }
});


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
            mongoose.model('UsuariosColaboradores', UsuColaboSchema);
            let Usuarios = mongoose.model('UsuariosColaboradores');
            Usuarios.find({ 'identificacion': loginSchema.entrada.usuario }).exec(function(err, data) {
                loginSchema.salida.codigoRespuesta = 500;
                loginSchema.salida.respuesta = 'Logueo incorrecto ' + data.toString;
                if (err) {
                    loginSchema.salida.codigoRespuesta = 600;
                    loginSchema.salida.respuesta = 'consulta con error';
                }
                if (data.length == 1) {
                    if (data[0].password == loginSchema.entrada.password) {
                        loginSchema.salida.codigoRespuesta = 0;
                        loginSchema.salida.respuesta = 'Logueo existoso';
                    }
                }
            });
            res.send(loginSchema);
        })
        .catch((err) => {
            loginSchema.salida.codigoRespuesta = 200;
            loginSchema.salida.respuesta = 'conexion no establecida ' + err;
            res.send(loginSchema);
        });
});


module.exports = router;