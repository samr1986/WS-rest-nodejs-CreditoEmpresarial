var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var UtilizacionesRouter = require('./routes/Utilizaciones');
var loginRouter = require('./routes/login');
var subsanarExcepcionesRouter = require('./routes/subsanarExcepciones');
var ExcepcionesEmpresarialesRouter = require('./routes/ExcepcionesEmpresariales');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/utilizaciones', UtilizacionesRouter);
app.use('/login', loginRouter);
app.use('/subsanarExcepciones', subsanarExcepcionesRouter);
app.use('/excepcionesEmpresariales', ExcepcionesEmpresarialesRouter);

module.exports = app;