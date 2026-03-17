// Modelo de usuarios usando SQLite (con consultas parametrizadas para evitar SQL injection)
const db = require('../db');
const bcrypt = require('bcryptjs');

async function findUser(email) {
  const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
  return rows[0] || null;
}

async function addUser({ nombre, email, password }) {
  const hashed = await bcrypt.hash(password, 10);
  const [result] = await db.query(
    'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
    [nombre, email, hashed]
  );
  return result.insertId;
}

async function getUsers() {
  const [rows] = await db.query('SELECT id, nombre, email, plan_id, created_at FROM usuarios');
  return rows;
}

async function saveUserPlan(email, planId) {
  await db.query('UPDATE usuarios SET plan_id = ? WHERE email = ?', [planId, email]);
}

async function verifyPassword(email, password) {
  const user = await findUser(email);
  if (!user) return false;
  return bcrypt.compare(password, user.password);
}

module.exports = { findUser, addUser, getUsers, saveUserPlan, verifyPassword };
