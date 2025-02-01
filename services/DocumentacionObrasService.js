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

class DocumentacionObrasService {
  async findAll() {
    const query = 'SELECT * FROM public.documentacion_obras';
    const res = await client.query(query);
    return res.rows;
  }

  async findOne(id) {
    const query = 'SELECT * FROM public.documentacion_obras WHERE documentacion_id = $1';
    const res = await client.query(query, [id]);
    return res.rows[0];
  }

  async create(data) {
    const query = `
      INSERT INTO public.documentacion_obras (codigo_obra, codigo_sgs, documentado)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [data.codigo_obra, data.codigo_sgs, data.documentado];
    const res = await client.query(query, values);
    return res.rows[0];
  }

  async update(id, changes) {
    const query = `
      UPDATE public.documentacion_obras SET
        codigo_obra = $1,
        codigo_sgs = $2,
        documentado = $3
      WHERE documentacion_id = $4
      RETURNING *;
    `;
    const values = [
      changes.codigo_obra,
      changes.codigo_sgs,
      changes.documentado,
      id,
    ];
    const res = await client.query(query, values);
    return res.rows[0];
  }

  async delete(id) {
    const query = 'DELETE FROM public.documentacion_obras WHERE documentacion_id = $1 RETURNING *';
    const res = await client.query(query, [id]);
    return res.rows[0];
  }
}

module.exports = DocumentacionObrasService;
