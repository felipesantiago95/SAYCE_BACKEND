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

class ApoderadosService {
  
  async findAll() {
    const res = await client.query('SELECT * FROM public.apoderados');
    return res.rows;
  }

  async findOne(id) {
    const res = await client.query('SELECT * FROM public.apoderados WHERE socio_id = $1', [id]);
    return res.rows;
  }

  async create(data) {
    const query = `
      INSERT INTO public.apoderados (
        socio_id, nombre, apellido, cedula, relacion
      ) VALUES (
        $1, $2, $3, $4, $5
      ) RETURNING *`;

    const values = [
      data.socio_id, 
      data.nombre, 
      data.apellido, 
      data.cedula, 
      data.relacion
    ];

    const res = await client.query(query, values);
    return res.rows[0];
  }

  async update(id, changes) {
    const query = `
      UPDATE public.apoderados SET
        socio_id=$1, 
        nombre=$2, 
        apellido=$3, 
        cedula=$4, 
        relacion=$5
      WHERE apoderado_id=$6 RETURNING *`;

    const values = [
      changes.socio_id, 
      changes.nombre, 
      changes.apellido, 
      changes.cedula, 
      changes.relacion, 
      id
    ];

    const res = await client.query(query, values);
    return res.rows[0];
  }

  async delete(id) {
    const query = 'DELETE FROM public.apoderados WHERE apoderado_id = $1 RETURNING *';
    const res = await client.query(query, [id]);
    return res.rows[0];
  }
}

module.exports = ApoderadosService;
