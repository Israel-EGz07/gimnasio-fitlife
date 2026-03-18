// Modelo de reseñas
const db = require('../db');

async function getReseñasAprobadas() {
  const [rows] = await db.query(
    'SELECT * FROM reseñas WHERE aprobado = 1 ORDER BY created_at DESC'
  );
  return rows;
}

async function getAllReseñas() {
  const [rows] = await db.query('SELECT * FROM reseñas ORDER BY created_at DESC');
  return rows;
}

async function addReseña({ nombre, email, calificacion, comentario, usuario_id }) {
  const [result] = await db.query(
    'INSERT INTO reseñas (nombre, email, usuario_id, calificacion, comentario) VALUES (?, ?, ?, ?, ?)',
    [nombre, email, usuario_id || null, calificacion, comentario]
  );
  return result.insertId;
}

async function aprobarReseña(id) {
  const [result] = await db.query(
    'UPDATE reseñas SET aprobado = 1 WHERE id = ?',
    [id]
  );
  return result.affectedRows;
}

async function eliminarReseña(id) {
  const [result] = await db.query('DELETE FROM reseñas WHERE id = ?', [id]);
  return result.affectedRows;
}

// Obtener estadísticas de reseñas (solo aprobadas)
async function getEstadisticas() {
  const [rows] = await db.query(`
    SELECT 
      COUNT(*) as total,
      ROUND(AVG(calificacion), 1) as promedio,
      SUM(CASE WHEN calificacion = 1 THEN 1 ELSE 0 END) as uno_estrellas,
      SUM(CASE WHEN calificacion = 2 THEN 1 ELSE 0 END) as dos_estrellas,
      SUM(CASE WHEN calificacion = 3 THEN 1 ELSE 0 END) as tres_estrellas,
      SUM(CASE WHEN calificacion = 4 THEN 1 ELSE 0 END) as cuatro_estrellas,
      SUM(CASE WHEN calificacion = 5 THEN 1 ELSE 0 END) as cinco_estrellas
    FROM reseñas WHERE aprobado = 1
  `);
  return rows[0];
}

// Incrementar contador de "me fue útil"
async function incrementUtil(id) {
  const [result] = await db.query(
    'UPDATE reseñas SET util_count = util_count + 1 WHERE id = ?',
    [id]
  );
  return result.affectedRows;
}

module.exports = {
  getReseñasAprobadas,
  getAllReseñas,
  addReseña,
  aprobarReseña,
  eliminarReseña,
  getEstadisticas,
  incrementUtil
};
