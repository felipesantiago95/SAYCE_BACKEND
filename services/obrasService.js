const { Client } = require('pg');
require('dotenv').config();

const db = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect();

// Obtener todas las obras con participaciones
const getAllObras = async () => {
  const query = `
    SELECT o.socio_id,o.obra_id, o.codigo_obra, o.titulo, o.descripcion, o.genero,
           p.participacion_id, p.socio_ip_definitivo, p.porcentaje_participacion, p.rol
    FROM obras o
    LEFT JOIN participaciones p ON o.obra_id = p.obra_id;
  `;
  const result = await db.query(query);
  return result.rows;
};
const getsociosObras = async () => {
    const query = `
      SELECT SOCIO_ID,IP_DEFINITIVO,NOMBRES_COMPLETOS FROM SOCIOS;
    `;
    const result = await db.query(query);
    return result.rows;
  };

// Obtener una obra por ID
const getObraById = async (obraId) => {
  const query = `
    SELECT o.obra_id, o.codigo_obra, o.titulo, o.descripcion, o.genero,
           p.participacion_id, p.socio_ip_definitivo, p.porcentaje_participacion, p.rol
    FROM obras o
    LEFT JOIN participaciones p ON o.obra_id = p.obra_id
    WHERE o.obra_id = $1;
  `;
  const result = await db.query(query, [obraId]);

  if (result.rows.length === 0) {
    throw new Error(`Obra con ID ${obraId} no encontrada`);
  }
  return result.rows;
};

const getObraBySocioId = async (socioId) => {
    const query = `
      SELECT o.obra_id, o.codigo_obra, o.titulo, o.descripcion, o.genero,
             p.participacion_id, p.socio_ip_definitivo, p.porcentaje_participacion, p.rol
      FROM obras o
      LEFT JOIN participaciones p ON o.obra_id = p.obra_id
      WHERE o.socio_id = $1;
    `;
    const result = await db.query(query, [socioId]);
  
    if (result.rows.length === 0) {
      throw new Error(`Obra con ID ${obraId} no encontrada`);
    }
    return result.rows;
  };

// Crear una nueva obra
const createObra = async (obraData) => {
    const { socio_id, titulo, descripcion, genero, participaciones } = obraData;
  
    // Validar que el porcentaje total sea 100
    const totalParticipacion = participaciones.reduce(
      (sum, p) => sum + p.porcentaje_participacion,
      0
    );
    if (totalParticipacion !== 100) {
      throw new Error('El porcentaje total de participación debe sumar 100%');
    }
  
    // Insertar obra con el socio relacionado
    const obraQuery = `
      INSERT INTO obras (socio_id, codigo_obra, titulo, descripcion, genero)
      VALUES ($1, gen_random_uuid(), $2, $3, $4) RETURNING obra_id;
    `;
    const obraResult = await db.query(obraQuery, [socio_id, titulo, descripcion, genero]);
    const obraId = obraResult.rows[0].obra_id;
  
    // Insertar participaciones
    const participacionQuery = `
      INSERT INTO participaciones (obra_id, nombre, porcentaje_participacion, rol)
      VALUES ($1, $2, $3, $4);
    `;
    for (const participacion of participaciones) {
      await db.query(participacionQuery, [
        obraId,
        participacion.nombre,
        participacion.porcentaje_participacion,
        participacion.rol,
      ]);
    }
  
    return { message: 'Obra creada exitosamente', obraId };
  };
  

// Actualizar una obra
const updateObra = async (obraId, obraData) => {
  const { titulo, descripcion, genero, participaciones } = obraData;

  const totalParticipacion = participaciones.reduce(
    (sum, p) => sum + p.porcentaje_participacion,
    0
  );

  if (totalParticipacion !== 100) {
    throw new Error('El porcentaje total de participación debe sumar 100%');
  }

  const obraQuery = `
    UPDATE obras SET titulo = $1, descripcion = $2, genero = $3
    WHERE obra_id = $4;
  `;
  await db.query(obraQuery, [titulo, descripcion, genero, obraId]);

  const deleteParticipacionesQuery = `DELETE FROM participaciones WHERE obra_id = $1;`;
  await db.query(deleteParticipacionesQuery, [obraId]);

  const participacionQuery = `
    INSERT INTO participaciones (obra_id, socio_ip_definitivo, porcentaje_participacion, rol)
    VALUES ($1, $2, $3, $4);
  `;

  for (const participacion of participaciones) {
    await db.query(participacionQuery, [
      obraId,
      participacion.socio_ip_definitivo,
      participacion.porcentaje_participacion,
      participacion.rol,
    ]);
  }

  return { message: 'Obra actualizada exitosamente' };
};

// Eliminar una obra
const deleteObra = async (obraId) => {
  const obraQuery = `DELETE FROM obras WHERE obra_id = $1;`;
  await db.query(obraQuery, [obraId]);
  return { message: `Obra con ID ${obraId} eliminada correctamente` };
};

module.exports = {
  getAllObras,
  getsociosObras,
  getObraBySocioId,
  getObraById,
  createObra,
  updateObra,
  deleteObra,
};
