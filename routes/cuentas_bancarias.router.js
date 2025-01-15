const express = require('express');
const CuentasBancariasService = require('../services/cuentas_bancarias.service');
const { verificarRol } = require('../middlewares/roles'); // Middleware para roles
const authenticateToken = require('../middlewares/auth'); // Middleware para autenticación

const router = express.Router();
const service = new CuentasBancariasService();

// Obtener todas las cuentas bancarias (accesible por administrador y supervisor)
router.get(
  '/',
  verificarRol(['administrador', 'supervisor']),
  async (req, res, next) => {
    try {
      const cuentas = await service.findAll();
      res.json(cuentas);
    } catch (error) {
      next(error);
    }
  }
);

// Obtener una cuenta bancaria por ID (accesible por administrador y supervisor)
router.get(
  '/:id',
  verificarRol(['administrador', 'supervisor']),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const cuenta = await service.findOne(id);
      res.json(cuenta);
    } catch (error) {
      next(error);
    }
  }
);

// Crear una nueva cuenta bancaria (solo administrador y supervisor)
router.post(
  '/',
  verificarRol(['administrador', 'supervisor']),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newCuenta = await service.create(body);
      res.status(201).json(newCuenta);
    } catch (error) {
      next(error);
    }
  }
);

// Actualizar una cuenta bancaria existente (solo administrador y supervisor)
router.patch(
  '/:id',
  verificarRol(['administrador', 'supervisor']),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const updatedCuenta = await service.update(id, body);
      res.json(updatedCuenta);
    } catch (error) {
      next(error);
    }
  }
);

// Eliminar una cuenta bancaria (solo administrador)
router.delete(
  '/:id',
  verificarRol(['administrador']),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedCuenta = await service.delete(id);
      res.json(deletedCuenta);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
