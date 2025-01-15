const express = require('express');
const RegaliasService = require('../services/regalias.service');
const { verificarRol } = require('../middlewares/roles');

const router = express.Router();
const service = new RegaliasService();

// Ruta para obtener todas las regalías (accesible por administrador, supervisor y operador)
router.get('/', verificarRol(['administrador', 'supervisor', 'operador']), async (req, res, next) => {
  try {
    const regalias = await service.findAll();
    res.json(regalias);
  } catch (error) {
    next(error);
  }
});

// Ruta para obtener una regalía por ID (accesible por administrador, supervisor y operador)
router.get('/:id', verificarRol(['administrador', 'supervisor', 'operador']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const regalia = await service.findOne(id);
    res.json(regalia);
  } catch (error) {
    next(error);
  }
});

// Ruta para crear una nueva regalía (solo administrador y supervisor)
router.post('/', verificarRol(['administrador', 'supervisor']), async (req, res, next) => {
  try {
    const body = req.body;
    const newRegalia = await service.create(body);
    res.status(201).json(newRegalia);
  } catch (error) {
    next(error);
  }
});

// Ruta para actualizar una regalía existente (solo administrador y supervisor)
router.patch('/:id', verificarRol(['administrador', 'supervisor']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedRegalia = await service.update(id, body);
    res.json(updatedRegalia);
  } catch (error) {
    next(error);
  }
});

// Ruta para eliminar una regalía (solo administrador)
router.delete('/:id', verificarRol(['administrador']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedRegalia = await service.delete(id);
    res.json(deletedRegalia);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
