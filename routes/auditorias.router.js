const express=require('express');
const { faker } = require('@faker-js/faker');

// Lista de operaciones
const operaciones = ["CREATE", "READ", "UPDATE", "DELETE"];

const router=express.Router();
router.get('/',(req,res)=>{
  const auditorias=[];
  const{size}=req.query;
  const limit=size||10;
  for(let index=0;index<limit;index++)
    {
      auditorias.push(
        {
          auditoria_id: faker.datatype.uuid(), // ID único para cada registro de auditoría
          tabla_nombre: faker.database.column(), // Nombre de la tabla afectada
          operacion: faker.helpers.arrayElement(operaciones), // Operación aleatoria
          registro_id: faker.datatype.uuid(), // ID del registro afectado
          usuario_id: faker.datatype.uuid(), // ID del usuario que realizó la operación
          fecha: faker.date.recent(), // Fecha y hora de la operación
          cambios: faker.lorem.sentence(), // Descripción de los cambios realizados
        });
    }
res.json(auditorias);
});


module.exports=router;

