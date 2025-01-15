const express = require('express');
const CiudadesService = require('../services/ciudades.service');

const router = express.Router();
const service = new CiudadesService();

// Obtener todas las ciudades
router.get('/', async (req, res, next) => {
  try {
    const ciudades = await service.findAll_detail();
    res.json(ciudades);
  } catch (error) {
    next(error);
  }
});

// Obtener una ciudad por ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const ciudad = await service.findOne(id);
    res.json(ciudad);
  } catch (error) {
    next(error);
  }
});

// Crear una nueva ciudad
router.post('/', async (req, res, next) => {
  try {
    const body = req.body;
    const newCiudad = await service.create(body);
    res.status(201).json(newCiudad);
  } catch (error) {
    next(error);
  }
});

// Actualizar una ciudad existente
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedCiudad = await service.update(id, body);
    res.json(updatedCiudad);
  } catch (error) {
    next(error);
  }
});

// Eliminar una ciudad
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedCiudad = await service.delete(id);
    res.json(deletedCiudad);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
