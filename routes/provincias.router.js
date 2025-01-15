const express = require('express');
const ProvinciasService = require('../services/provincias.service');

const router = express.Router();
const service = new ProvinciasService();

// Obtener todas las provincias
router.get('/', async (req, res, next) => {
  try {
    const provincias = await service.findAll();
    res.json(provincias);
  } catch (error) {
    next(error);
  }
});

// Obtener una provincia por ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const provincia = await service.findOne(id);
    res.json(provincia);
  } catch (error) {
    next(error);
  }
});

// Crear una nueva provincia
router.post('/', async (req, res, next) => {
  try {
    const body = req.body;
    const newProvincia = await service.create(body);
    res.status(201).json(newProvincia);
  } catch (error) {
    next(error);
  }
});

// Actualizar una provincia existente
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedProvincia = await service.update(id, body);
    res.json(updatedProvincia);
  } catch (error) {
    next(error);
  }
});

// Eliminar una provincia
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedProvincia = await service.delete(id);
    res.json(deletedProvincia);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
