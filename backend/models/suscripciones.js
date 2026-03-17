// Modelo para suscripciones en base de datos separada
const db = require('../db');

async function crearSuscripcion({ userId = null, email = null, planId = null, planNombre = null, monto = null, fechaInicio = null }) {
  await db.query(
    'INSERT INTO suscripciones (user_id, email, plan_id, plan_nombre, monto, fecha_inicio) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, email, planId, planNombre, monto, fechaInicio]
  );
}

async function obtenerSuscripciones() {
  const [rows] = await db.query('SELECT * FROM suscripciones ORDER BY creado_at DESC LIMIT 100');
  return rows;
}

module.exports = { crearSuscripcion, obtenerSuscripciones };
