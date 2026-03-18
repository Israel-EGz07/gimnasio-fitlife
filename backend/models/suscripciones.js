// Modelo para suscripciones en base de datos separada
const db = require('../db');

// Duración del plan en días (30 días = 1 mes)
const DURACION_PLAN_DIAS = 30;

function calcularFechaFin(fechaInicio) {
  const inicio = new Date(fechaInicio);
  const fin = new Date(inicio);
  fin.setDate(fin.getDate() + DURACION_PLAN_DIAS);
  return fin.toISOString().slice(0, 10);
}

function verificarExpiracion(fechaFin) {
  if (!fechaFin) return { expirada: true, diasRestantes: 0 };
  
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fin = new Date(fechaFin);
  fin.setHours(0, 0, 0, 0);
  
  const diffTime = fin - hoy;
  const diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return {
    expirada: diasRestantes <= 0,
    diasRestantes: diasRestantes > 0 ? diasRestantes : 0
  };
}

async function crearSuscripcion({ userId = null, email = null, planId = null, planNombre = null, monto = null, fechaInicio = null }) {
  const fechaFin = calcularFechaFin(fechaInicio);
  const estado = 'activa';
  
  await db.query(
    'INSERT INTO suscripciones (user_id, email, plan_id, plan_nombre, monto, fecha_inicio, fecha_fin, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [userId, email, planId, planNombre, monto, fechaInicio, fechaFin, estado]
  );
}

async function obtenerSuscripciones() {
  const [rows] = await db.query('SELECT * FROM suscripciones ORDER BY creado_at DESC LIMIT 100');
  return rows;
}

async function obtenerSuscripcionActiva(email) {
  const [rows] = await db.query(
    'SELECT * FROM suscripciones WHERE email = ? AND estado = "activa" ORDER BY creado_at DESC LIMIT 1',
    [email]
  );
  return rows[0] || null;
}

async function obtenerUltimaSuscripcion(email) {
  const [rows] = await db.query(
    'SELECT * FROM suscripciones WHERE email = ? ORDER BY creado_at DESC LIMIT 1',
    [email]
  );
  return rows[0] || null;
}

module.exports = { 
  crearSuscripcion, 
  obtenerSuscripciones, 
  obtenerSuscripcionActiva,
  obtenerUltimaSuscripcion,
  calcularFechaFin,
  verificarExpiracion,
  DURACION_PLAN_DIAS
};
