const express = require('express');
const router = express.Router();
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('banco.json')
const db = low(adapter)

router.post('/horario', (req, res, next) => {
  db.get('horario')
    .push({id: 1, semanal: false, hora_inicial: '17:00', hora_final: '17:30'})
    .write()

  res.status(201).send({
    response: 'Horário cadastrado.',
    version: '1.0.0'
  });

});

module.exports = router;