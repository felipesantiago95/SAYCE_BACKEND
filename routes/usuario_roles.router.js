const express = require('express');
const UsuarioRolesService = require('../services/usuario_roles.service');

const router = express.Router();
const service = new UsuarioRolesService();

// Obtener todos los registros de usuario_roles
router.get('/', async (req, res, next) => {
  try {
    const usuarioRoles = await service.findAll();
    res.json(usuarioRoles);
  } catch (error) {
    next(error);
  }
});

// Obtener un registro de usuario_rol por ID compuesto (usuario_id y rol_id)
router.get('/:usuario_id/:rol_id', async (req, res, next) => {
  try {
    const { usuario_id, rol_id } = req.params;
    const usuarioRol = await service.findOne(usuario_id, rol_id);
    res.json(usuarioRol);
  } catch (error) {
    next(error);
  }
});

// Crear un nuevo registro de usuario_rol
router.post('/', async (req, res, next) => {
  try {
    const body = req.body;
    const newUsuarioRol = await service.create(body);
    res.status(201).json(newUsuarioRol);
  } catch (error) {
    next(error);
  }
});

// Actualizar un registro de usuario_rol existente
router.patch('/:usuario_id/:rol_id', async (req, res, next) => {
  try {
    const { usuario_id, rol_id } = req.params;
    const body = req.body;
    const updatedUsuarioRol = await service.update(usuario_id, rol_id, body);
    res.json(updatedUsuarioRol);
  } catch (error) {
    next(error);
  }
});

// Eliminar un registro de usuario_rol
router.delete('/:usuario_id/:rol_id', async (req, res, next) => {
  try {
    const { usuario_id, rol_id } = req.params;
    const deletedUsuarioRol = await service.delete(usuario_id, rol_id);
    res.json(deletedUsuarioRol);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
