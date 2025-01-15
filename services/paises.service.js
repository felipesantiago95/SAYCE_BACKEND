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

class PaisesService {
  // Método para obtener todos los registros de la tabla paises
  async findAll() {
    const res = await client.query('SELECT * FROM public.paises');
    return res.rows;
  }

  // Método para obtener un registro por ID
  async findOne(id) {
    const res = await client.query('SELECT * FROM public.paises WHERE pais_id = $1', [id]);
    return res.rows[0];
  }

  // Método para insertar un nuevo registro en la tabla paises
  async create(data) {
    const query = `
      INSERT INTO public.paises (
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

  // Método para actualizar un registro existente en la tabla paises
  async update(id, changes) {
    const query = `
      UPDATE public.paises SET
        nombre=$1
      WHERE pais_id=$2 RETURNING *`;

    const values = [
      changes.nombre,
      id
    ];

    const res = await client.query(query, values);
    return res.rows[0];
  }

  // Método para eliminar un registro existente en la tabla paises
  async delete(id) {
    const query = 'DELETE FROM public.paises WHERE pais_id = $1 RETURNING *';
    const res = await client.query(query, [id]);
    return res.rows[0];
  }
}

module.exports = PaisesService;
