// Modelo para registros (logs) en base de datos separada
const db = require('../db');

async function crearRegistro({ userId = null, email = null, accion, detalle = null }) {
  await db.query(
    'INSERT INTO registros (user_id, email, accion, detalle) VALUES (?, ?, ?, ?)',
    [userId, email, accion, detalle]
  );
}

async function obtenerRegistros() {
  const [rows] = await db.query('SELECT * FROM registros ORDER BY creado_at DESC LIMIT 100');
  return rows;
}

module.exports = { crearRegistro, obtenerRegistros };
