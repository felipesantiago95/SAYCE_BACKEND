const { Client } = require('pg');
require('dotenv').config();
const bcrypt = require('bcrypt');

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

client.connect();

class UsuariosService {
  // Método para obtener todos los registros de la tabla usuarios
  async findAll() {
    const res = await client.query('SELECT * FROM public.usuarios');
    return res.rows;
  }

  // Método para obtener un registro por ID
  async findOne(id) {
    const res = await client.query('SELECT * FROM public.usuarios WHERE usuario_id = $1', [id]);
    return res.rows[0];
  }

  // Método para obtener un usuario por email
  async findByEmail(email) {
    const res = await client.query('SELECT * FROM public.usuarios WHERE email = $1', [email]);
    return res.rows[0];
  }

  // Método para insertar un nuevo registro en la tabla usuarios
  async create(data) {
    const query = `
      INSERT INTO public.usuarios (
        email, password, nombres, apellidos, cargo, creado_en, actualizado_en
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7
      ) RETURNING *`;

    const values = [
      data.email,
      data.password,
      data.nombres,
      data.apellidos,
      data.cargo,
      data.creado_en || new Date(),
      data.actualizado_en || new Date()
    ];

    const res = await client.query(query, values);
    return res.rows[0];
  }

  // Método para actualizar un registro existente en la tabla usuarios
  async update(id, changes) {
    console.log("cambios: ",changes)
    const query = `
      UPDATE public.usuarios SET
        email=$1,
        nombres=$2,
        apellidos=$3,
        actualizado_en=$4,
        rol=$5
      WHERE usuario_id=$6 RETURNING *`;

    const values = [
      changes.email,
      changes.nombres,
      changes.apellidos,
      changes.actualizado_en || new Date(),
      changes.rol,
      id
    ];

    const res = await client.query(query, values);
    return res.rows[0];
  }

  // Método para eliminar un registro existente en la tabla usuarios
  async delete(id) {
    const query = 'DELETE FROM public.usuarios WHERE usuario_id = $1 RETURNING *';
    const res = await client.query(query, [id]);
    return res.rows[0];
  }
  async findByEmail(email) {
    const query = 'SELECT * FROM usuarios WHERE email = $1';
    const result = await client.query(query, [email]);
    return result.rows[0];
  }

  async savePasswordResetToken(userId, token) {
    const expiration = new Date(Date.now() + 3600000); // 1 hora
    const query = `
      UPDATE usuarios
      SET reset_token = $1, reset_token_expiration = $2
      WHERE id = $3
    `;
    await client.query(query, [token, expiration, userId]);
  }

  async verifyResetToken(token) {
    const query = `
      SELECT id FROM usuarios
      WHERE reset_token = $1 AND reset_token_expiration > NOW()
    `;
    const result = await client.query(query, [token]);
    return result.rows[0]?.id;
  }

  async updatePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const query = `
      UPDATE usuarios
      SET password = $1, reset_token = NULL, reset_token_expiration = NULL
      WHERE id = $2
    `;
    await client.query(query, [hashedPassword, userId]);
  }
}

module.exports = UsuariosService;
