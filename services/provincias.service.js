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

class ProvinciasService {
  
  async findAll() {
    const res = await client.query('SELECT * FROM public.provincias');
    return res.rows;
  }

  
  async findOne(id) {
    const res = await client.query('SELECT * FROM public.provincias WHERE provincia_id = $1', [id]);
    return res.rows[0];
  }

  
  async create(data) {
    const query = `
      INSERT INTO public.provincias (
        nombre, pais_id
      ) VALUES (
        $1, $2
      ) RETURNING *`;

    const values = [
      data.nombre,
      data.pais_id
    ];

    const res = await client.query(query, values);
    return res.rows[0];
  }

  
  async update(id, changes) {
    const query = `
      UPDATE public.provincias SET
        nombre=$1,
        pais_id=$2
      WHERE provincia_id=$3 RETURNING *`;

    const values = [
      changes.nombre,
      changes.pais_id,
      id
    ];

    const res = await client.query(query, values);
    return res.rows[0];
  }

 
  async delete(id) {
    const query = 'DELETE FROM public.provincias WHERE provincia_id = $1 RETURNING *';
    const res = await client.query(query, [id]);
    return res.rows[0];
  }
}

module.exports = ProvinciasService;
