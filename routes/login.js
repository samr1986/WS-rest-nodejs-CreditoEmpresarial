var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var env = require('dotenv').config();


router.get('/', function(req, res, next) {
    let result = ' dsad ';
    mongoose.connect(process.env.COSMOSDB_CONNSTR + "?ssl=true&replicaSet=globaldb", {
            auth: {
                user: process.env.COSMODDB_USER,
                password: process.env.COSMOSDB_PASSWORD
            }
        })
        .then(() => res.send('que tiene ' + result))
        .catch((err) => res.send('que tiene ' + err));

});

module.exports = router;