const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UsuariosService = require('../services/usuarios.service'); // Servicio de Usuarios
const { verificarRol } = require('../middlewares/roles'); // Middleware de roles
const authenticateToken = require('../middlewares/auth'); // Middleware de autenticación

const usuariosService = new UsuariosService(); // Instancia de UsuariosService

// Ruta para crear un nuevo usuario (registro) - Solo para Administradores
router.post(
  '/register',
  verificarRol(['administrador']),
  async (req, res) => {
    const { email, password, nombres, apellidos, cargo, rol } = req.body;

    try {
      // Validar rol
      if (!['administrador', 'supervisor', 'operador'].includes(rol)) {
        return res.status(400).json({ message: 'Rol no válido' });
      }

      // Cifrar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear el nuevo usuario usando el servicio
      const newUser = await usuariosService.create({
        email,
        password: hashedPassword, // Contraseña cifrada
        nombres,
        apellidos,
        cargo,
        rol, // Asignar el rol
      });

      // Responder con el nuevo usuario creado
      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Error al registrar usuario', error });
    }
  }
);

// Ruta de login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar al usuario por email
    const user = await usuariosService.findByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar JWT con el rol
    const token = jwt.sign(
      { id: user.usuario_id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Devolver el token y el rol
    res.json({ token, rol: user.rol });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error durante el inicio de sesión', error });
  }
});

// Ruta protegida para obtener el perfil del usuario autenticado
router.get('/profile', authenticateToken, (req, res) => {
  // Información del perfil del usuario autenticado
  res.json({ message: 'Perfil de usuario', user: req.user });
});

// Ruta para listar todos los usuarios (Solo Administrador y Supervisor)
router.get(
  '/',
  verificarRol(['administrador']),
  async (req, res) => {
    try {
      const users = await usuariosService.findAll();
      console.log("usuarios",users)
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener usuarios', error });
    }
  }
);

// Ruta para eliminar un usuario por ID (Solo Administrador)
router.delete(
  '/:id',
  authenticateToken,
  verificarRol(['administrador']),
  async (req, res) => {
    const { id } = req.params;

    try {
      await usuariosService.delete(id);
      res.status(204).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al eliminar usuario', error });
    }
  }
);

module.exports = router;
