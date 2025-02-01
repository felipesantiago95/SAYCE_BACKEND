const express = require('express');
const SociosService = require('../services/socios.service');
const { verificarRol } = require('../middlewares/roles');

const router = express.Router();
const service = new SociosService();

// Ruta para obtener todos los socios (accesible por administrador, supervisor y operador)
router.get('/', verificarRol(['administrador', 'supervisor', 'operador']), async (req, res, next) => {
  try {
    const socios = await service.findAll();
    res.json(socios);
  } catch (error) {
    next(error);
  }
});
router.get('/desafiliados', verificarRol(['administrador', 'supervisor', 'operador']), async (req, res, next) => {
  try {
    const socios = await service.find_des_All();
    res.json(socios);
  } catch (error) {
    next(error);
  }
});

// Ruta para obtener un socio por ID (accesible por administrador, supervisor y operador)
router.get('/:id', verificarRol(['administrador', 'supervisor', 'operador']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const socio = await service.findOne(id);
    res.json(socio);
  } catch (error) {
    next(error);
  }
});

// Ruta para crear un nuevo socio (solo administrador y supervisor)
router.post('/', verificarRol(['administrador', 'supervisor']), async (req, res, next) => {
  try {
    const body = req.body;
    const newSocio = await service.create(body);
    res.status(201).json(newSocio);
  } catch (error) {
    next(error);
  }
});
router.post('/min', verificarRol(['administrador', 'supervisor']), async (req, res, next) => {
  try {
    const body = req.body;
    const newSocio = await service.create_min(body);
    res.status(201).json(newSocio);
  } catch (error) {
    next(error);
  }
});

// Ruta para actualizar un socio existente (solo administrador y supervisor)
router.patch('/:id', verificarRol(['administrador', 'supervisor', 'operador']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedSocio = await service.update(id, body);
    res.json(updatedSocio);
  } catch (error) {
    next(error);
  }
});

// Ruta para eliminar un socio (solo administrador)
router.delete('/:id', verificarRol(['administrador']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedSocio = await service.delete(id);
    res.json(deletedSocio);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
