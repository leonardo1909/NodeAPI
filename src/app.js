const express = require('express');
const bodyParser = require('body-parser')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('banco.json')
const db = low(adapter)
db_horario = db.get('horario')

if(typeof db_horario.value() === 'undefined'){
    db.defaults({ horario: [], count: 0 }).write()
}
// App
const app = express();
app.use(bodyParser.json())

// Load routes
const cadastrar = require('./routes/horario');
app.use('/', cadastrar);

module.exports = app;
