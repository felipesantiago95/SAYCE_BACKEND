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

class HerederosService {
 
  async findAll() {
    const res = await client.query('SELECT * FROM public.herederos');
    return res.rows;
  }

  async findOne(id) {
    const res = await client.query('SELECT * FROM public.herederos WHERE socio_id = $1', [id]);
    return res.rows;
  }


  async create(data) {
    const query = `
      INSERT INTO public.herederos (
        socio_id, nombre, cedula, parentesco, 
        padre_id, observacion
      ) VALUES (
        $1, $2, $3, $4, $5, $6
      ) RETURNING *`;

    const values = [
      data.socio_id, 
      data.nombre, 
      data.cedula, 
      data.parentesco, 
      data.padre_id, 
      data.observacion
    ];

    const res = await client.query(query, values);
    return res.rows[0];
  }


  async update(id, changes) {
    const query = `
      UPDATE public.herederos SET
        socio_id=$1, 
        nombre=$2, 
        cedula=$3, 
        parentesco=$4, 
        padre_id=$5, 
        observacion=$6
      WHERE heredero_id=$7 RETURNING *`;

    const values = [
      changes.socio_id, 
      changes.nombre, 
      changes.cedula, 
      changes.parentesco, 
      changes.padre_id, 
      changes.observacion, 
      id
    ];

    const res = await client.query(query, values);
    return res.rows[0];
  }

  
  async delete(id) {
    const query = 'DELETE FROM public.herederos WHERE heredero_id = $1 RETURNING *';
    const res = await client.query(query, [id]);
    return res.rows[0];
  }
}

module.exports = HerederosService;
