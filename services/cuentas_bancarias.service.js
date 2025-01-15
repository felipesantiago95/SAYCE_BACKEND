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

class CuentasBancariasService {
  // Método para obtener todos los registros de la tabla cuentas_bancarias
  async findAll() {
    const res = await client.query('SELECT * FROM public.cuentas_bancarias');
    return res.rows;
  }

  // Método para obtener un registro por ID
  async findOne(id) {
    const res = await client.query('SELECT * FROM public.cuentas_bancarias WHERE socio_id = $1', [id]);
    return res.rows;
  }

  // Método para insertar un nuevo registro en la tabla cuentas_bancarias
  async create(data) {
    const query = `
      INSERT INTO public.cuentas_bancarias (
        socio_id, banco_id, tipo_cuenta_id, numero_cuenta
      ) VALUES (
        $1, $2, $3, $4
      ) RETURNING *`;

    const values = [
      data.socio_id, 
      data.banco_id, 
      data.tipo_cuenta_id, 
      data.numero_cuenta
    ];

    const res = await client.query(query, values);
    return res.rows[0];
  }

  // Método para actualizar un registro existente en la tabla cuentas_bancarias
  async update(id, changes) {
    const query = `
      UPDATE public.cuentas_bancarias SET
        socio_id=$1,
        banco_id=$2,
        tipo_cuenta_id=$3,
        numero_cuenta=$4
      WHERE cuenta_bancaria_id=$5 RETURNING *`;

    const values = [
      changes.socio_id, 
      changes.banco_id, 
      changes.tipo_cuenta_id, 
      changes.numero_cuenta, 
      id
    ];

    const res = await client.query(query, values);
    return res.rows[0];
  }

  // Método para eliminar un registro existente en la tabla cuentas_bancarias
  async delete(id) {
    const query = 'DELETE FROM public.cuentas_bancarias WHERE cuenta_bancaria_id = $1 RETURNING *';
    const res = await client.query(query, [id]);
    return res.rows[0];
  }
}

module.exports = CuentasBancariasService;
