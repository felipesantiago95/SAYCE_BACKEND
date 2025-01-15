const express = require('express');
const BancosService = require('../services/bancos.service');

const router = express.Router();
const service = new BancosService();

// Obtener todos los bancos
router.get('/', async (req, res, next) => {
  try {
    const bancos = await service.findAll();
    res.json(bancos);
  } catch (error) {
    next(error);
  }
});

// Obtener un banco por ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const banco = await service.findOne(id);
    res.json(banco);
  } catch (error) {
    next(error);
  }
});

// Crear un nuevo banco
router.post('/', async (req, res, next) => {
  try {
    const body = req.body;
    const newBanco = await service.create(body);
    res.status(201).json(newBanco);
  } catch (error) {
    next(error);
  }
});

// Actualizar un banco existente
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedBanco = await service.update(id, body);
    res.json(updatedBanco);
  } catch (error) {
    next(error);
  }
});

// Eliminar un banco
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedBanco = await service.delete(id);
    res.json(deletedBanco);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
