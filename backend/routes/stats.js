const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/stats', async (req, res) => {
  try {
    const [totalUsers] = await db.query('SELECT COUNT(*) as count FROM usuarios');
    const [totalSuscripciones] = await db.query('SELECT COUNT(*) as count FROM suscripciones');
    const [avgPrecio] = await db.query('SELECT AVG(monto) as avg FROM suscripciones');
    const [planesActivos] = await db.query('SELECT COUNT(DISTINCT plan_id) as count FROM usuarios WHERE plan_id IS NOT NULL');

    res.json({
      totalUsuarios: totalUsers[0].count,
      suscripcionesActivas: totalSuscripciones[0].count,
      precioPromedio: Math.round(avgPrecio[0].avg || 0),
      planesUnicos: planesActivos[0].count,
      ultimaActualizacion: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: 'Error en stats' });
  }
});

module.exports = router;
