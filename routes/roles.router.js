const express = require('express');
const RolesService = require('../services/roles.service');

const router = express.Router();
const service = new RolesService();

// Obtener todos los roles
router.get('/', async (req, res, next) => {
  try {
    const roles = await service.findAll();
    res.json(roles);
  } catch (error) {
    next(error);
  }
});

// Obtener un rol por ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const rol = await service.findOne(id);
    res.json(rol);
  } catch (error) {
    next(error);
  }
});

// Crear un nuevo rol
router.post('/', async (req, res, next) => {
  try {
    const body = req.body;
    const newRol = await service.create(body);
    res.status(201).json(newRol);
  } catch (error) {
    next(error);
  }
});

// Actualizar un rol existente
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedRol = await service.update(id, body);
    res.json(updatedRol);
  } catch (error) {
    next(error);
  }
});

// Eliminar un rol
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedRol = await service.delete(id);
    res.json(deletedRol);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
