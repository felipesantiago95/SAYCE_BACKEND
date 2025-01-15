const { Client } = require('pg');
require('dotenv').config();
const conn = require('./../libs/postgres.js');

const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

client.connect();

class FacturasService {
  async findAll() {
    const query = `
      SELECT
        factura_id,
        socio_id,
        numero_factura,
        fecha,
        valor,
        descripcion,
        valor * 0.3 AS gasto_administrativo,
        valor * 0.1 AS fondo_social,
        valor * 0.05 AS otros_descuentos,
        valor - (valor * 0.3 + valor * 0.1 + valor * 0.05) AS valor_final
      FROM facturas;
    `;
    const res = await client.query(query);
    return res.rows;
  }

  async findOne(id) {
    const query = `
      SELECT
        factura_id,
        socio_id,
        numero_factura,
        fecha,
        valor,
        descripcion,
        valor * 0.3 AS gasto_administrativo,
        valor * 0.1 AS fondo_social,
        valor * 0.05 AS otros_descuentos,
        valor - (valor * 0.3 + valor * 0.1 + valor * 0.05) AS valor_final
      FROM facturas
      WHERE socio_id = $1;
    `;
    const res = await client.query(query, [id]);
    if (res.rows.length === 0) {
      throw new Error('Factura no encontrada');
    }
    return res.rows;
  }

  async create(data) {
    const query = `
      INSERT INTO facturas (socio_id, numero_factura, fecha, valor, descripcion)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [data.socio_id, data.numero_factura, data.fecha, data.valor, data.descripcion];
    const res = await client.query(query, values);
    return res.rows[0];
  }
}

module.exports = FacturasService;
