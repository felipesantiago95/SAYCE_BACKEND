const express = require('express');
const PaisesService = require('../services/paises.service');

const router = express.Router();
const service = new PaisesService();

// Obtener todos los países
router.get('/', async (req, res, next) => {
  try {
    const paises = await service.findAll();
    res.json(paises);
  } catch (error) {
    next(error);
  }
});

// Obtener un país por ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const pais = await service.findOne(id);
    res.json(pais);
  } catch (error) {
    next(error);
  }
});

// Crear un nuevo país
router.post('/', async (req, res, next) => {
  try {
    const body = req.body;
    const newPais = await service.create(body);
    res.status(201).json(newPais);
  } catch (error) {
    next(error);
  }
});

// Actualizar un país existente
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedPais = await service.update(id, body);
    res.json(updatedPais);
  } catch (error) {
    next(error);
  }
});

// Eliminar un país
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedPais = await service.delete(id);
    res.json(deletedPais);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
