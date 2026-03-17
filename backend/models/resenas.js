// Modelo de reseñas
const db = require('../db');

async function getReseñasAprobadas() {
  const [rows] = await db.query(
    'SELECT * FROM reseñas WHERE aprobado = 1 ORDER BY creado_at DESC'
  );
  return rows;
}

async function getAllReseñas() {
  const [rows] = await db.query('SELECT * FROM reseñas ORDER BY creado_at DESC');
  return rows;
}

async function addReseña({ nombre, email, calificacion, comentario }) {
  const [result] = await db.query(
    'INSERT INTO reseñas (nombre, email, calificacion, comentario) VALUES (?, ?, ?, ?)',
    [nombre, email, calificacion, comentario]
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

module.exports = {
  getReseñasAprobadas,
  getAllReseñas,
  addReseña,
  aprobarReseña,
  eliminarReseña
};
