const express = require('express');
const router = express.Router();
const users = require('../models/users');
const plans = require('../models/plans');
const suscripciones = require('../models/suscripciones');
const registros = require('../models/registros');
const { isEmail, isPositiveInteger } = require('../utils/validation');

// Inscripción a plan
router.post('/inscribir', async (req, res) => {
  const { email, planId } = req.body;

  if (!isEmail(email) || !isPositiveInteger(planId)) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  try {
    const user = await users.findUser(email);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const plan = await plans.findPlanById(planId);
    if (!plan) return res.status(404).json({ error: 'Plan no encontrado' });

    await users.saveUserPlan(email, planId);

    // Guardar suscripción en la base de datos de suscripciones
    await suscripciones.crearSuscripcion({
      userId: user.id,
      email,
      planId: plan.id,
      planNombre: plan.nombre,
      monto: plan.precio,
      fechaInicio: new Date().toISOString().slice(0, 10)
    });

    // Registrar la acción
    await registros.crearRegistro({
      userId: user.id,
      email,
      accion: 'inscripción',
      detalle: `Se inscribió al plan ${plan.nombre}`
    });

    res.json({ ok: true, plan });
  } catch (err) {
    console.error('Error en /api/inscribir:', err);
    res.status(500).json({ error: 'Error al inscribir al plan' });
  }
});

// Simulación de pago
router.post('/pagar', (req, res) => {
  // Aquí solo simulamos el pago
  res.json({ ok: true, mensaje: 'Pago realizado con éxito' });
});

module.exports = router;