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

class DetalleSegurosService {
  // Método para obtener todos los registros de la tabla detalle_seguros
  async findAll() {
    const res = await client.query('SELECT * FROM public.detalle_seguros');
    return res.rows;
  }

  // Método para obtener un registro por ID
  async findOne(id) {
    const res = await client.query('SELECT * FROM public.detalle_seguros WHERE detalle_id = $1', [id]);
    return res.rows[0];
  }

  // Método para insertar un nuevo registro en la tabla detalle_seguros
  async create(data) {
    const query = `
      INSERT INTO public.detalle_seguros (
        socio_id, seguro_id, detalle
      ) VALUES (
        $1, $2, $3
      ) RETURNING *`;

    const values = [
      data.socio_id,
      data.seguro_id,
      data.detalle
    ];

    const res = await client.query(query, values);
    return res.rows[0];
  }

  // Método para actualizar un registro existente en la tabla detalle_seguros
  async update(id, changes) {
    const query = `
      UPDATE public.detalle_seguros SET
        socio_id=$1,
        seguro_id=$2,
        detalle=$3
      WHERE detalle_id=$4 RETURNING *`;

    const values = [
      changes.socio_id,
      changes.seguro_id,
      changes.detalle,
      id
    ];

    const res = await client.query(query, values);
    return res.rows[0];
  }

  // Método para eliminar un registro existente en la tabla detalle_seguros
  async delete(id) {
    const query = 'DELETE FROM public.detalle_seguros WHERE detalle_id = $1 RETURNING *';
    const res = await client.query(query, [id]);
    return res.rows[0];
  }
}

module.exports = DetalleSegurosService;
