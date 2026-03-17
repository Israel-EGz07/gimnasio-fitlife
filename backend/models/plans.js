// Modelo de planes usando MySQL
const db = require('../db');

async function getPlanes() {
  const [rows] = await db.query('SELECT * FROM planes');
  return rows;
}

async function findPlanById(id) {
  const [rows] = await db.query('SELECT * FROM planes WHERE id = ?', [id]);
  return rows[0] || null;
}

module.exports = { getPlanes, findPlanById };
