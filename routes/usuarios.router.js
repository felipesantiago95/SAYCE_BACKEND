const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
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



router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Verificar si el correo existe en la base de datos
    const user = await usuariosService.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    console.log("ususario encontrado por email: ",user)
    // Generar un token único
    const token = crypto.randomBytes(32).toString('hex');

    // Guardar el token y su expiración en la base de datos
    //await usuariosService.savePasswordResetToken(user.usuario_id, token);

    // Crear el enlace para la recuperación de contraseña
    const resetLink = `http://localhost:8081/reset-password?token=${token}`;
console.log("mail: ",process.env.EMAIL_USER," pass",process.env.EMAIL_PASS)
    // Configurar transportador para Office365
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER, // Correo de Office365
        pass: process.env.EMAIL_PASS, // Contraseña de Office365
      },
    });

    // Configurar y enviar el correo
    await transporter.sendMail({
      from: `"Soporte Técnico" <${process.env.EMAIL_USER}>`, // Correo del remitente
      to: email,
      subject: 'Recuperación de Contraseña',
      html: `
        <p>Hola,</p>
        <p>Hemos recibido una solicitud para restablecer tu contraseña. Si no fuiste tú, ignora este mensaje.</p>
        <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Este enlace expirará en 1 hora.</p>
        <p>Gracias,</p>
        <p>Equipo de Soporte</p>
      `,
    });

    res.json({ message: 'Correo de recuperación enviado correctamente.' });
  } catch (error) {
    console.error('Error en forgot-password:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud.' });
  }
});


router.put('/:id', verificarRol(['administrador', 'supervisor']), async (req, res, next) => {
  try {
    const { id } = req.params; // ID del usuario a actualizar
    const changes = req.body; // Cambios enviados desde el frontend
    console.log(req.body);
    const updatedUser = await usuariosService.update(id, changes);

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Endpoint para restablecer contraseña
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const userId = await usuariosService.verifyResetToken(token);
    if (!userId) {
      return res.status(400).json({ message: 'Token inválido o expirado.' });
    }
    await service.updatePassword(userId, newPassword);
    res.json({ message: 'Contraseña restablecida con éxito.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al restablecer la contraseña.' });
  }
});

module.exports = router;
