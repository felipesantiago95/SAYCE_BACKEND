const express = require('express');
const HerederosService = require('../services/herederos.service');
const { verificarRol } = require('../middlewares/roles'); // Middleware para roles

const router = express.Router();
const service = new HerederosService();

// Obtener todos los herederos (accesible por administrador, supervisor y operador)
router.get(
  '/',
  verificarRol(['administrador', 'supervisor', 'operador']),
  async (req, res, next) => {
    try {
      const herederos = await service.findAll();
      res.json(herederos);
    } catch (error) {
      next(error);
    }
  }
);

// Obtener un heredero por ID (accesible por administrador, supervisor y operador)
router.get(
  '/:id',
  verificarRol(['administrador', 'supervisor', 'operador']),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const heredero = await service.findOne(id);
      res.json(heredero);
    } catch (error) {
      next(error);
    }
  }
);

// Crear un nuevo heredero (solo administrador y supervisor)
router.post(
  '/',
  verificarRol(['administrador', 'supervisor']),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newHeredero = await service.create(body);
      res.status(201).json(newHeredero);
    } catch (error) {
      next(error);
    }
  }
);

// Actualizar un heredero existente (solo administrador y supervisor)
router.patch(
  '/:id',
  verificarRol(['administrador', 'supervisor']),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const updatedHeredero = await service.update(id, body);
      res.json(updatedHeredero);
    } catch (error) {
      next(error);
    }
  }
);

// Eliminar un heredero (solo administrador)
router.delete(
  '/:id',
  verificarRol(['administrador']),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedHeredero = await service.delete(id);
      res.json(deletedHeredero);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
