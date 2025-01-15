const express = require('express');
const ApoderadosService = require('../services/apoderados.service');

const router = express.Router();
const service = new ApoderadosService();

// Obtener todos los apoderados
router.get('/', async (req, res, next) => {
  try {
    const apoderados = await service.findAll();
    res.json(apoderados);
  } catch (error) {
    next(error);
  }
});

// Obtener un apoderado por ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const apoderado = await service.findOne(id);
    res.json(apoderado);
  } catch (error) {
    next(error);
  }
});

// Crear un nuevo apoderado
router.post('/', async (req, res, next) => {
  try {
    const body = req.body;
    const newApoderado = await service.create(body);
    res.status(201).json(newApoderado);
  } catch (error) {
    next(error);
  }
});

// Actualizar un apoderado existente
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedApoderado = await service.update(id, body);
    res.json(updatedApoderado);
  } catch (error) {
    next(error);
  }
});

// Eliminar un apoderado
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedApoderado = await service.delete(id);
    res.json(deletedApoderado);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
