// regalias.service.js - Servicio para la tabla 'regalias'
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

class RegaliasService {
  async findAll() {
    const res = await client.query('SELECT * FROM public.regalias');
    return res.rows;
  }

  async findOne(id) {
    const res = await client.query('SELECT * FROM public.regalias WHERE socio_id = $1', [id]);
    if (res.rows.length === 0) {
      throw new Error('Regalia not found');
    }
    return res.rows;
  }

  async create(data) {
    const query = `
      INSERT INTO public.regalias (
        socio_id, cod_billing, cod_mem_sq, ip_complete, ip_name,
        cod_soc, mem_type, cod_interno, mem_money, bruto_da,
        dis_collect, mem_taxes_n, mem_money_net, cod_pay_class,
        des_pay_class, cod_rate_return
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *;
    `;
    const values = [
      data.socio_id, data.cod_billing, data.cod_mem_sq, data.ip_complete, data.ip_name,
      data.cod_soc, data.mem_type, data.cod_interno, data.mem_money, data.bruto_da,
      data.dis_collect, data.mem_taxes_n, data.mem_money_net, data.cod_pay_class,
      data.des_pay_class, data.cod_rate_return
    ];
    const res = await client.query(query, values);
    return res.rows[0];
  }

  async update(id, changes) {
    const query = `
      UPDATE public.regalias SET
        socio_id = $1, cod_billing = $2, cod_mem_sq = $3, ip_complete = $4, ip_name = $5,
        cod_soc = $6, mem_type = $7, cod_interno = $8, mem_money = $9, bruto_da = $10,
        dis_collect = $11, mem_taxes_n = $12, mem_money_net = $13, cod_pay_class = $14,
        des_pay_class = $15, cod_rate_return = $16
      WHERE regalia_id = $17
      RETURNING *;
    `;
    const values = [
      changes.socio_id, changes.cod_billing, changes.cod_mem_sq, changes.ip_complete, changes.ip_name,
      changes.cod_soc, changes.mem_type, changes.cod_interno, changes.mem_money, changes.bruto_da,
      changes.dis_collect, changes.mem_taxes_n, changes.mem_money_net, changes.cod_pay_class,
      changes.des_pay_class, changes.cod_rate_return, id
    ];
    const res = await client.query(query, values);
    if (res.rows.length === 0) {
      throw new Error('Regalia not found');
    }
    return res.rows[0];
  }

  async delete(id) {
    const res = await client.query('DELETE FROM public.regalias WHERE regalia_id = $1 RETURNING *', [id]);
    if (res.rows.length === 0) {
      throw new Error('Regalia not found');
    }
    return res.rows[0];
  }
}

module.exports = RegaliasService;
