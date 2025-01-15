const express = require('express');
const TipoCuentaService = require('../services/tipo_cuenta.service');

const router = express.Router();
const service = new TipoCuentaService();

// Obtener todos los tipos de cuenta
router.get('/', async (req, res, next) => {
  try {
    const tipos = await service.findAll();
    res.json(tipos);
  } catch (error) {
    next(error);
  }
});

// Obtener un tipo de cuenta por ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const tipo = await service.findOne(id);
    res.json(tipo);
  } catch (error) {
    next(error);
  }
});

// Crear un nuevo tipo de cuenta
router.post('/', async (req, res, next) => {
  try {
    const body = req.body;
    const newTipo = await service.create(body);
    res.status(201).json(newTipo);
  } catch (error) {
    next(error);
  }
});

// Actualizar un tipo de cuenta existente
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedTipo = await service.update(id, body);
    res.json(updatedTipo);
  } catch (error) {
    next(error);
  }
});

// Eliminar un tipo de cuenta
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedTipo = await service.delete(id);
    res.json(deletedTipo);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
