const express = require('express');
const DetalleSegurosService = require('../services/detalle_seguros.service');

const router = express.Router();
const service = new DetalleSegurosService();


router.get('/', async (req, res, next) => {
  try {
    const detalles = await service.findAll();
    res.json(detalles);
  } catch (error) {
    next(error);
  }
});


router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const detalle = await service.findOne(id);
    res.json(detalle);
  } catch (error) {
    next(error);
  }
});


router.post('/', async (req, res, next) => {
  try {
    const body = req.body;
    const newDetalle = await service.create(body);
    res.status(201).json(newDetalle);
  } catch (error) {
    next(error);
  }
});


router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedDetalle = await service.update(id, body);
    res.json(updatedDetalle);
  } catch (error) {
    next(error);
  }
});


router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedDetalle = await service.delete(id);
    res.json(deletedDetalle);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
