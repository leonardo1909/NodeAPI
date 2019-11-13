const express = require('express');

// App
const app = express();

// Load routes
const indexRoutes = require('./routes/index-routes');
app.use('/', indexRoutes);

const cadastrar = require('./routes/horario');
app.use('/', cadastrar);

module.exports = app;
