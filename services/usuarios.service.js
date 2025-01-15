const { Client } = require('pg');
require('dotenv').config();

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
    const query = `
      UPDATE public.usuarios SET
        email=$1,
        password=$2,
        nombres=$3,
        apellidos=$4,
        cargo=$5,
        creado_en=$6,
        actualizado_en=$7
      WHERE usuario_id=$8 RETURNING *`;

    const values = [
      changes.email,
      changes.password,
      changes.nombres,
      changes.apellidos,
      changes.cargo,
      changes.creado_en || new Date(),
      changes.actualizado_en || new Date(),
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
}

module.exports = UsuariosService;
