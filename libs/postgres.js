require('dotenv').config();  // Cargar las variables de entorno desde el archivo .env

const { Client } = require('pg');

const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

async function testConnection() {
    try {
        await client.connect();
        console.log('Conexión a PostgreSQL exitosa');
        // Puedes ejecutar una consulta de prueba si lo deseas
        const res = await client.query('SELECT NOW()');
        console.log('Hora actual en la base de datos:', res.rows[0].now);
    } catch (err) {
        console.error('Error al conectar a PostgreSQL:', err.stack);
    } finally {
        await client.end();
    }
}

// Llamada a la función para probar la conexión
testConnection();

module.exports = client;
