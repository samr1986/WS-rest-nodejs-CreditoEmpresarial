var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let mongoose = require('mongoose');
var loginRouter = require('./routes/login');
var subsanarExcepcionesRouter = require('./routes/subsanarExcepciones');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', loginRouter);
app.use('/subsanarExcepciones', subsanarExcepcionesRouter);

module.exports = app;