const express = require('express');
const multer = require('multer');
const ContratosService = require('../services/contratos.service');
const { verificarRol } = require('../middlewares/roles');

const router = express.Router();
const service = new ContratosService();
const upload = multer(); // Para manejar la subida de archivos

// Obtener todos los contratos
router.get('/', verificarRol(['administrador', 'supervisor', 'operador']), async (req, res, next) => {
  try {
    const contratos = await service.findAll();
    res.json(contratos);
  } catch (error) {
    next(error);
  }
});

// Obtener un contrato por ID
router.get('/:id', verificarRol(['administrador', 'supervisor', 'operador']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const contrato = await service.findOne(id);
    res.json(contrato);
  } catch (error) {
    next(error);
  }
});

router.get('/:id/archivo', verificarRol(['administrador', 'supervisor', 'operador']), async (req, res, next) => {
    try {
      const { id } = req.params;
      const archivo = await service.findArchivoById(id);
  
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="contrato_${id}.pdf"`);
      res.send(archivo);
    } catch (error) {
      next(error);
    }
  });
  

// Crear un contrato
router.post('/', verificarRol(['administrador', 'supervisor', 'operador']), upload.single('archivo'), async (req, res, next) => {
    try {
      const { socio_id, tipo_contrato } = req.body;
      const archivo = req.file?.buffer;
  
      console.log('Datos recibidos:', { socio_id, tipo_contrato });
      console.log('Archivo recibido:', req.file);
  
      if (!archivo) {
        return res.status(400).json({ message: 'Archivo PDF es obligatorio' });
      }

      console.log("LO QUE VA A GUARDAR",{ socio_id, tipo_contrato }, archivo)
  
      const newContrato = await service.create({ socio_id, tipo_contrato }, archivo);
      res.status(201).json(newContrato);
    } catch (error) {
      console.error('Error al guardar contrato:', error);
      next(error);
    }
  });
  
  

// Actualizar un contrato
router.patch('/:id', verificarRol(['administrador', 'supervisor', 'operador']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedContrato = await service.update(id, body);
    res.json(updatedContrato);
  } catch (error) {
    next(error);
  }
});

// Eliminar un contrato
router.delete('/:id', verificarRol(['administrador', 'supervisor', 'operador']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedContrato = await service.delete(id);
    res.json(deletedContrato);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
