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

class SegurosService {
  // Método para obtener todos los registros de la tabla seguros
  async findAll() {
    const res = await client.query('SELECT * FROM public.seguros');
    return res.rows;
  }

  // Método para obtener un registro por ID
  async findOne(id) {
    const res = await client.query('SELECT * FROM public.seguros WHERE seguro_id = $1', [id]);
    return res.rows[0];
  }

  // Método para insertar un nuevo registro en la tabla seguros
  async create(data) {
    const query = `
      INSERT INTO public.seguros (
        seguro, tipo_seguro
      ) VALUES (
        $1, $2
      ) RETURNING *`;

    const values = [
      data.seguro,
      data.tipo_seguro
    ];

    const res = await client.query(query, values);
    return res.rows[0];
  }

  // Método para actualizar un registro existente en la tabla seguros
  async update(id, changes) {
    const query = `
      UPDATE public.seguros SET
        seguro=$1,
        tipo_seguro=$2
      WHERE seguro_id=$3 RETURNING *`;

    const values = [
      changes.seguro,
      changes.tipo_seguro,
      id
    ];

    const res = await client.query(query, values);
    return res.rows[0];
  }

  // Método para eliminar un registro existente en la tabla seguros
  async delete(id) {
    const query = 'DELETE FROM public.seguros WHERE seguro_id = $1 RETURNING *';
    const res = await client.query(query, [id]);
    return res.rows[0];
  }
}

module.exports = SegurosService;
