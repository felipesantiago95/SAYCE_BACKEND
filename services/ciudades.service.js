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

class CiudadesService {
  // Método para obtener todos los registros de la tabla ciudades
  async findAll() {
    const res = await client.query('SELECT * FROM public.ciudades');
    return res.rows;
  }
  async findAll_detail() {
    const res = await client.query(`
      SELECT 
        a.ciudad_id,
        a.nombre || '-' || b.nombre || '-' || c.nombre AS "CIUDAD-PROVINCIA-PAIS"
      FROM 
        public.ciudades a
      INNER JOIN 
        public.provincias b ON a.provincia_id = b.provincia_id
      INNER JOIN 
        public.paises c ON b.pais_id = c.pais_id
    `);
    return res.rows;
  }

  // Método para obtener un registro por ID
  async findOne(id) {
    const res = await client.query('SELECT * FROM public.ciudades WHERE ciudad_id = $1', [id]);
    return res.rows[0];
  }

  // Método para insertar un nuevo registro en la tabla ciudades
  async create(data) {
    const query = `
      INSERT INTO public.ciudades (
        nombre, provincia_id
      ) VALUES (
        $1, $2
      ) RETURNING *`;

    const values = [
      data.nombre,
      data.provincia_id
    ];

    const res = await client.query(query, values);
    return res.rows[0];
  }

  // Método para actualizar un registro existente en la tabla ciudades
  async update(id, changes) {
    const query = `
      UPDATE public.ciudades SET
        nombre=$1,
        provincia_id=$2
      WHERE ciudad_id=$3 RETURNING *`;

    const values = [
      changes.nombre,
      changes.provincia_id,
      id
    ];

    const res = await client.query(query, values);
    return res.rows[0];
  }

  // Método para eliminar un registro existente en la tabla ciudades
  async delete(id) {
    const query = 'DELETE FROM public.ciudades WHERE ciudad_id = $1 RETURNING *';
    const res = await client.query(query, [id]);
    return res.rows[0];
  }
}

module.exports = CiudadesService;
