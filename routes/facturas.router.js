const express = require('express');
const FacturasService = require('../services/factura.service');
const { verificarRol } = require('../middlewares/roles');

const router = express.Router();
const service = new FacturasService();

router.get('/', verificarRol(['administrador', 'supervisor', 'operador']), async (req, res, next) => {
  try {
    const facturas = await service.findAll();
    res.json(facturas);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', verificarRol(['administrador', 'supervisor', 'operador']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const factura = await service.findOne(id);
    res.json(factura);
  } catch (error) {
    next(error);
  }
});

router.post('/', verificarRol(['administrador', 'supervisor']), async (req, res, next) => {
  try {
    const body = req.body;
    const newFactura = await service.create(body);
    res.status(201).json(newFactura);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
