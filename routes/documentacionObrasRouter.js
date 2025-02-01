const express = require('express');
const DocumentacionObrasService = require('../services/DocumentacionObrasService');
const { verificarRol } = require('../middlewares/roles');

const router = express.Router();
const service = new DocumentacionObrasService();

// Ruta para obtener todas las documentaciones de obras (accesible por todos los roles)
router.get('/', verificarRol(['administrador', 'supervisor', 'operador','documentador']), async (req, res, next) => {
  try {
    const documentaciones = await service.findAll();
    res.json(documentaciones);
  } catch (error) {
    next(error);
  }
});

// Ruta para obtener una documentación de obra por ID (accesible por todos los roles)
router.get('/:id', verificarRol(['administrador', 'supervisor', 'operador','documentador']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const documentacion = await service.findOne(id);
    res.json(documentacion);
  } catch (error) {
    next(error);
  }
});

// Ruta para crear una nueva documentación de obra (accesible solo por administrador y supervisor)
router.post('/', verificarRol(['administrador', 'supervisor','documentador']), async (req, res, next) => {
  try {
    const body = req.body;
    const nuevaDocumentacion = await service.create(body);
    res.status(201).json(nuevaDocumentacion);
  } catch (error) {
    next(error);
  }
});

// Ruta para actualizar una documentación de obra (accesible por administrador, supervisor y operador)
router.patch('/:id', verificarRol(['administrador', 'supervisor', 'operador','documentador']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const documentacionActualizada = await service.update(id, body);
    res.json(documentacionActualizada);
  } catch (error) {
    next(error);
  }
});

// Ruta para eliminar una documentación de obra (accesible solo por administrador)
router.delete('/:id', verificarRol(['administrador']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const documentacionEliminada = await service.delete(id);
    res.json(documentacionEliminada);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
