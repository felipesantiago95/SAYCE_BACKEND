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

class UsuarioRolesService {
  // Método para obtener todos los registros de la tabla usuario_roles
  async findAll() {
    const res = await client.query('SELECT * FROM public.usuario_roles');
    return res.rows;
  }

  // Método para obtener un registro por ID (usuario_id y rol_id)
  async findOne(usuario_id, rol_id) {
    const res = await client.query(
      'SELECT * FROM public.usuario_roles WHERE usuario_id = $1 AND rol_id = $2',
      [usuario_id, rol_id]
    );
    return res.rows[0];
  }

  // Método para insertar un nuevo registro en la tabla usuario_roles
  async create(data) {
    const query = `
      INSERT INTO public.usuario_roles (
        usuario_id, rol_id
      ) VALUES (
        $1, $2
      ) RETURNING *`;

    const values = [
      data.usuario_id,
      data.rol_id
    ];

    const res = await client.query(query, values);
    return res.rows[0];
  }

  // Método para actualizar un registro existente en la tabla usuario_roles
  async update(usuario_id, rol_id, changes) {
    const query = `
      UPDATE public.usuario_roles SET
        usuario_id=$1,
        rol_id=$2
      WHERE usuario_id=$3 AND rol_id=$4 RETURNING *`;

    const values = [
      changes.usuario_id,
      changes.rol_id,
      usuario_id,
      rol_id
    ];

    const res = await client.query(query, values);
    return res.rows[0];
  }

  // Método para eliminar un registro existente en la tabla usuario_roles
  async delete(usuario_id, rol_id) {
    const query = 'DELETE FROM public.usuario_roles WHERE usuario_id = $1 AND rol_id = $2 RETURNING *';
    const res = await client.query(query, [usuario_id, rol_id]);
    return res.rows[0];
  }
}

module.exports = UsuarioRolesService;
