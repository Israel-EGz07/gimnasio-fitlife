const express = require('express');
const router = express.Router();
const plans = require('../models/plans');

// Listado de planes
router.get('/planes', async (req, res) => {
  try {
    const lista = await plans.getPlanes();
    res.json(lista);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener planes' });
  }
});

module.exports = router;