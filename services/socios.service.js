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

class SociosService {
  async findAll() {
    const res = await client.query('SELECT * FROM public.socios');
    return res.rows;
  }

  async findOne(id) {
    const res = await client.query('SELECT * FROM public.socios WHERE socio_id = $1', [id]);
    return res.rows[0];
  }

  async create(data) {
    const query = `
      INSERT INTO public.socios (
        ip_provisional, codigo_provisional, codigo_socio, ip_definitivo,
        cedula, apellidos, nombres, nombres_completos, seudonimo_banda,
        observacion, bono, seguros_valor, seguros_categoria, ciudad_id,
        votan, representante, apoderados_asistir_asamblea, genero,
        vivo_fallecido, fecha_de_nacimiento, fecha_de_fallecimiento,
        fecha_de_afiliacion, territorios_afiliados, telefono_convencional,
        telefono_celular, telefono_celular_2, telefono_3_adicional,
        correo, email_secundario, direccion, calificacion,
        numero_senadi, ano_senadi, fecha_senadi, fecha_de_liberacion,
        nombre_sis_contable
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 
        $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, 
        $27, $28, $29, $30, $31, $32, $33, $34, $35
      ) RETURNING *`;

    const values = [
      data.ip_provisional, data.codigo_provisional, data.codigo_socio, data.ip_definitivo,
      data.cedula, data.apellidos, data.nombres, data.nombres_completos, data.seudonimo_banda,
      data.observacion, data.bono, data.seguros_valor, data.seguros_categoria, data.ciudad_id,
      data.votan, data.representante, data.apoderados_asistir_asamblea, data.genero,
      data.vivo_fallecido, data.fecha_de_nacimiento, data.fecha_de_fallecimiento,
      data.fecha_de_afiliacion, data.territorios_afiliados, data.telefono_convencional,
      data.telefono_celular, data.telefono_celular_2, data.telefono_3_adicional,
      data.correo, data.email_secundario, data.direccion, data.calificacion,
      data.numero_senadi, data.ano_senadi, data.fecha_senadi, data.fecha_de_liberacion,
      data.nombre_sis_contable
    ];

    const res = await client.query(query, values);
    return res.rows[0];
  }

  async update(id, changes) {
    const query = `
      UPDATE public.socios SET
        ip_provisional=$1, codigo_provisional=$2, codigo_socio=$3, ip_definitivo=$4,
        cedula=$5, apellidos=$6, nombres=$7, nombres_completos=$8, seudonimo_banda=$9,
        observacion=$10, bono=$11, seguros_valor=$12, seguros_categoria=$13, ciudad_id=$14,
        votan=$15, representante=$16, apoderados_asistir_asamblea=$17, genero=$18,
        vivo_fallecido=$19, fecha_de_nacimiento=$20, fecha_de_fallecimiento=$21,
        fecha_de_afiliacion=$22, territorios_afiliados=$23, telefono_convencional=$24,
        telefono_celular=$25, telefono_celular_2=$26, telefono_3_adicional=$27,
        correo=$28, email_secundario=$29, direccion=$30, calificacion=$31,
        numero_senadi=$32, ano_senadi=$33, fecha_senadi=$34, fecha_de_liberacion=$35,
        nombre_sis_contable=$36
      WHERE socio_id=$37 RETURNING *`;

    const values = [
      changes.ip_provisional, changes.codigo_provisional, changes.codigo_socio, changes.ip_definitivo,
      changes.cedula, changes.apellidos, changes.nombres, changes.nombres_completos, changes.seudonimo_banda,
      changes.observacion, changes.bono, changes.seguros_valor, changes.seguros_categoria, changes.ciudad_id,
      changes.votan, changes.representante, changes.apoderados_asistir_asamblea, changes.genero,
      changes.vivo_fallecido, changes.fecha_de_nacimiento, changes.fecha_de_fallecimiento,
      changes.fecha_de_afiliacion, changes.territorios_afiliados, changes.telefono_convencional,
      changes.telefono_celular, changes.telefono_celular_2, changes.telefono_3_adicional,
      changes.correo, changes.email_secundario, changes.direccion, changes.calificacion,
      changes.numero_senadi, changes.ano_senadi, changes.fecha_senadi, changes.fecha_de_liberacion,
      changes.nombre_sis_contable, id
    ];

    const res = await client.query(query, values);
    return res.rows[0];
  }

  async delete(id) {
    const query = 'DELETE FROM public.socios WHERE socio_id=$1 RETURNING *';
    const res = await client.query(query, [id]);
    return res.rows[0];
  }
}

module.exports = SociosService;
