const jwt = require('jsonwebtoken');

function verificarRol(rolesPermitidos) {
  return (req, res, next) => {
    try {
        console.log("authorizacion: ", req.headers.authorization)
      const token = req.headers.authorization.split(' ')[1]; // Extraer el token del encabezado
      const decoded = jwt.verify(token, 'mi_secreto_super_seguro'); // Reemplaza 'secret_key' por tu clave secreta
      const userRole = decoded.rol; // El rol debe estar en el payload del token
      console.log("authorizacion: ", token,"------",decoded,"------",userRole)
      if (!rolesPermitidos.includes(userRole)) {
        return res.status(403).json({ mensaje: 'Acceso denegado' });
      }

      next();
    } catch (error) {
      return res.status(403).json({ mensaje: 'Acceso denegado' });
    }
  };
}

module.exports = { verificarRol };
