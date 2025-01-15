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

class ContratosService {
  // Método para obtener todos los contratos
  async findAll() {
    const res = await client.query('SELECT * FROM public.contratos');
    return res.rows;
  }

  // Método para obtener un contrato por ID
  async findOne(id) {
    const res = await client.query('SELECT * FROM public.contratos WHERE socio_id = $1', [id]);
    return res.rows;
  }
  async findArchivoById(contratoId) {
    const query = 'SELECT archivo FROM public.contratos WHERE contrato_id = $1';
    const values = [contratoId];

    try {
      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        throw new Error('Contrato no encontrado');
      }
      return result.rows[0].archivo;
    } catch (error) {
      console.error('Error al obtener archivo:', error);
      throw error;
    }
  }

  // Método para crear un contrato nuevo
  async create(data,archivo) {
    const query = `
      INSERT INTO public.contratos (
        socio_id, tipo_contrato, archivo
      ) VALUES (
        $1, $2, $3
      ) RETURNING *`;

    const values = [
      data.socio_id,
      data.tipo_contrato,
      archivo, // Archivo en formato binario (BYTEA)
    ];
    console.log('datos para cuardar', values)
    const res = await client.query(query, values);
    return res.rows[0];
  }

  // Método para actualizar un contrato existente
  async update(id, changes) {
    const query = `
      UPDATE public.contratos SET
        socio_id = $1,
        tipo_contrato = $2,
        archivo = $3
      WHERE contrato_id = $4 RETURNING *`;

    const values = [
      changes.socio_id,
      changes.tipo_contrato,
      changes.archivo, // Archivo en formato binario (BYTEA)
      id,
    ];

    const res = await client.query(query, values);
    return res.rows[0];
  }

  // Método para eliminar un contrato
  async delete(id) {
    const query = 'DELETE FROM public.contratos WHERE contrato_id = $1 RETURNING *';
    const res = await client.query(query, [id]);
    return res.rows[0];
  }
}

module.exports = ContratosService;
