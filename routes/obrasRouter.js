const express = require('express');
const obrasService = require('../services/obrasService');
const { verificarRol } = require('../middlewares/roles');

const router = express.Router();


// Obtener todas las obras (accesible por administrador y supervisor)
router.get('/', verificarRol(['administrador', 'supervisor']), async (req, res) => {
  try {
    const obras = await obrasService.getAllObras();
    res.status(200).json(obras);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener todas las obras relacionadas con socios (accesible por administrador, supervisor y operador)
router.get('/socios', verificarRol(['administrador', 'supervisor', 'operador','documentador']), async (req, res) => {
  try {
    const obras = await obrasService.getsociosObras();
    res.status(200).json(obras);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/valobras', verificarRol(['administrador', 'supervisor', 'operador','documentador']), async (req, res) => {
  try {
    const obras = await obrasService.getsociosObrasVal();
    res.status(200).json(obras);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener una obra por ID de socio (accesible por administrador, supervisor y operador)
router.get('/socios/:id', verificarRol(['administrador', 'supervisor', 'operador','documentador']), async (req, res) => {
  try {
    const obra = await obrasService.getObraBySocioId(req.params.id);
    res.status(200).json(obra);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Obtener una obra por ID (accesible por administrador y supervisor)
router.get('/:id', verificarRol(['administrador', 'supervisor','documentador']), async (req, res) => {
  try {
    const obra = await obrasService.getObraById(req.params.id);
    res.status(200).json(obra);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Crear una nueva obra (solo administrador y supervisor)
router.post('/', verificarRol(['administrador', 'supervisor','documentador']), async (req, res) => {
  try {
    console.log(req.body);
    const nuevaObra = await obrasService.createObra(req.body);
    console.log(nuevaObra);
    res.status(201).json(nuevaObra);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Actualizar una obra existente (solo administrador y supervisor)
router.put('/:id', verificarRol(['administrador', 'supervisor','documentador']), async (req, res) => {
  try {
    const obraActualizada = await obrasService.updateObra(req.params.id, req.body);
    res.status(200).json(obraActualizada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar una obra (solo administrador)
router.delete('/:id', verificarRol(['administrador','documentador']), async (req, res) => {
  try {
    const result = await obrasService.deleteObra(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;
