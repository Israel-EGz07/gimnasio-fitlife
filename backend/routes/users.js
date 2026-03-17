const express = require('express');
const router = express.Router();
const users = require('../models/users');
const suscripciones = require('../models/suscripciones');
const registros = require('../models/registros');
const { isEmail, isPositiveInteger } = require('../utils/validation');

// Registro de usuario
router.post('/registro', async (req, res) => {
  const { nombre, email, password } = req.body;
  
  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  if (!isEmail(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
  }

  try {
    const existing = await users.findUser(email);
    if (existing) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const userId = await users.addUser({ nombre, email, password });
    
    await registros.crearRegistro({
      userId,
      email,
      accion: 'registro',
      detalle: 'Nuevo usuario registrado'
    });

    res.json({ ok: true, mensaje: 'Usuario registrado exitosamente', userId });
  } catch (err) {
    console.error('Error en /api/registro:', err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    const user = await users.findUser(email);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const valid = await users.verifyPassword(email, password);
    if (!valid) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    await registros.crearRegistro({
      userId: user.id,
      email,
      accion: 'login',
      detalle: 'Usuario inició sesión'
    });

    res.json({ 
      ok: true, 
      user: { 
        id: user.id, 
        nombre: user.nombre, 
        email: user.email,
        plan_id: user.plan_id
      }
    });
  } catch (err) {
    console.error('Error en /api/login:', err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// GET /api/usuario - Perfil + historial del usuario
router.get('/usuario', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email requerido' });
  }

  try {
    const user = await users.findUser(email);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Obtener historial de suscripciones
    const [suscripcionesData] = await require('../db').query(
      'SELECT * FROM suscripciones WHERE email = ? ORDER BY creado_at DESC',
      [email]
    );

    // Obtener historial de registros
    const [registrosData] = await require('../db').query(
      'SELECT * FROM registros WHERE email = ? ORDER BY creado_at DESC LIMIT 20',
      [email]
    );

    // Obtener info del plan actual
    let planActual = null;
    if (user.plan_id) {
      const [planes] = await require('../db').query(
        'SELECT * FROM planes WHERE id = ?',
        [user.plan_id]
      );
      planActual = planes[0] || null;
    }

    res.json({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      plan_id: user.plan_id,
      planActual,
      suscripciones: suscripcionesData,
      historial: registrosData,
      created_at: user.created_at
    });
  } catch (err) {
    console.error('Error en /api/usuario:', err);
    res.status(500).json({ error: 'Error al obtener datos del usuario' });
  }
});

// Listar todos los usuarios (para admin)
router.get('/usuarios', async (req, res) => {
  try {
    const lista = await users.getUsers();
    res.json(lista);
  } catch (err) {
    console.error('Error en /api/usuarios:', err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

module.exports = router;
