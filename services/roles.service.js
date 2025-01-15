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

class RolesService {
  // Método para obtener todos los registros de la tabla roles
  async findAll() {
    const res = await client.query('SELECT * FROM public.roles');
    return res.rows;
  }

  // Método para obtener un registro por ID
  async findOne(id) {
    const res = await client.query('SELECT * FROM public.roles WHERE rol_id = $1', [id]);
    return res.rows[0];
  }

  // Método para insertar un nuevo registro en la tabla roles
  async create(data) {
    const query = `
      INSERT INTO public.roles (
        nombre
      ) VALUES (
        $1
      ) RETURNING *`;

    const values = [
      data.nombre
    ];

    const res = await client.query(query, values);
    return res.rows[0];
  }

  // Método para actualizar un registro existente en la tabla roles
  async update(id, changes) {
    const query = `
      UPDATE public.roles SET
        nombre=$1
      WHERE rol_id=$2 RETURNING *`;

    const values = [
      changes.nombre,
      id
    ];

    const res = await client.query(query, values);
    return res.rows[0];
  }

  // Método para eliminar un registro existente en la tabla roles
  async delete(id) {
    const query = 'DELETE FROM public.roles WHERE rol_id = $1 RETURNING *';
    const res = await client.query(query, [id]);
    return res.rows[0];
  }
}

module.exports = RolesService;
