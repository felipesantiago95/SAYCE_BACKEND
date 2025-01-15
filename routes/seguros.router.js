const express = require('express');
const SegurosService = require('../services/seguros.service');

const router = express.Router();
const service = new SegurosService();


router.get('/', async (req, res, next) => {
  try {
    const seguros = await service.findAll();
    res.json(seguros);
  } catch (error) {
    next(error);
  }
});


router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const seguro = await service.findOne(id);
    res.json(seguro);
  } catch (error) {
    next(error);
  }
});


router.post('/', async (req, res, next) => {
  try {
    const body = req.body;
    const newSeguro = await service.create(body);
    res.status(201).json(newSeguro);
  } catch (error) {
    next(error);
  }
});


router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedSeguro = await service.update(id, body);
    res.json(updatedSeguro);
  } catch (error) {
    next(error);
  }
});


router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedSeguro = await service.delete(id);
    res.json(deletedSeguro);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
