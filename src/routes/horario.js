const express = require('express');
const router = express.Router();
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('banco.json')
const db = low(adapter)


router.post('/horario', (req, res, next) => {
  id = db.get('count')
  if(req.query['data']){
    data=req.body['data'].split("-");
    var data=data[1]+"/"+data[0]+"/"+data[2];
  }

  db.get('horario')
    .push(
      {
        id: id,
        timestamp: new Date(data).getTime(),
        data: req.body['data'],
        semanal: req.body['semanal'],
        diario: req.body['diario'],
        dia: req.body['dia'],
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

router.get('/horario', (req, res, next) => {
  var response = []

  if(req.query['data_inicio'] && req.query['data_fim']){
    data_inicio = req.query['data_inicio'].split("-");
    data_inicio = data_inicio[1]+"/"+data_inicio[0]+"/"+data_inicio[2];
    data_inicio_stamp = new Date(data_inicio).getTime();

    data_fim = req.query['data_fim'].split("-");
    data_fim = data_fim[1]+"/"+data_fim[0]+"/"+data_fim[2];
    data_fim_stamp = new Date(data_fim).getTime();



    var date = new Date(data_inicio);
    var date_fim = new Date(data_fim);
    date_fim.setDate(date_fim.getDate() + 1);
    data_fim_stamp = date_fim.getTime()

    while (data_inicio_stamp !== data_fim_stamp){
      intervals = [];
      var horarios = db.get('horario').filter((
        (obj =>
          (obj.diario == true) ||
          (obj.semanal == true && obj.dia == date.getDay()) ||
          (obj.timestamp === data_inicio_stamp)
        )
      )).sortBy("hora_inicial")
      .values()

      var next = horarios.next()
      while (!next.done){
          intervals.push(
            {
              "start": next.value['hora_inicial'],
              "end": next.value['hora_final']
            }
          )
          next = horarios.next()
      }

      response.push(
        {
          "day": date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear(),
          "intervals": intervals
        }
      )

      date.setDate(date.getDate() + 1);
      data_inicio_stamp = date.getTime()
    }
  }
  else{
    response = db.get('horario').values()
  }



  res.status(200).send({
    response
  });

});

router.delete('/horario', (req, res, next) =>{
  var response = "";
  if(req.body['id']){
    db.get('horario')
      .remove({ id: req.body['id'] })
      .write()
    }
  else{
    response = "Horário não encontrado."
  }

  res.status(200).send({
    response
  });
});

module.exports = router;