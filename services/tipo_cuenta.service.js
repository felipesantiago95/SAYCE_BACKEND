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

class TipoCuentaService {
 
  async findAll() {
    const res = await client.query('SELECT * FROM public.tipo_cuenta');
    return res.rows;
  }


  async findOne(id) {
    const res = await client.query('SELECT * FROM public.tipo_cuenta WHERE tipo_cuenta_id = $1', [id]);
    return res.rows[0];
  }

 
  async create(data) {
    const query = `
      INSERT INTO public.tipo_cuenta (
        descripcion
      ) VALUES (
        $1
      ) RETURNING *`;

    const values = [
      data.descripcion
    ];

    const res = await client.query(query, values);
    return res.rows[0];
  }

 
  async update(id, changes) {
    const query = `
      UPDATE public.tipo_cuenta SET
        descripcion=$1
      WHERE tipo_cuenta_id=$2 RETURNING *`;

    const values = [
      changes.descripcion,
      id
    ];

    const res = await client.query(query, values);
    return res.rows[0];
  }


  async delete(id) {
    const query = 'DELETE FROM public.tipo_cuenta WHERE tipo_cuenta_id = $1 RETURNING *';
    const res = await client.query(query, [id]);
    return res.rows[0];
  }
}

module.exports = TipoCuentaService;
