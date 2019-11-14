const express = require('express');
const router = express.Router();
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('banco.json')
const db = low(adapter)


router.post('/horario', (req, res, next) => {
  // db.defaults({ horario: [], count: 0 }).write()
  id = db.get('count')
  data=req.body['data'].split("-");
  var data=data[1]+"/"+data[0]+"/"+data[2];

  db.get('horario')
    .push(
      {
        id: id,
        data: new Date(data).getTime(),
        semanal: req.body['semanal'],
        diario: req.body['diario'],
        hora_inicial: req.body['hr_inicio'],
        hora_final: req.body['hr_fim']
      }
    )
    .write()

    db.set('count', id+1)
    .write()

  res.status(201).send({
    response: 'Horário cadastrado com sucesso.'
  });

});

module.exports = router;