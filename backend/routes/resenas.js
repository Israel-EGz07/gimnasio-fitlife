const express = require('express');
const router = express.Router();
const resenas = require('../models/resenas');

// GET /api/resenas - Obtener reseñas aprobadas (público)
router.get('/resenas', async (req, res) => {
  try {
    const lista = await resenas.getReseñasAprobadas();
    res.json(lista);
  } catch (err) {
    console.error('Error en /api/resenas:', err);
    res.status(500).json({ error: 'Error al obtener reseñas' });
  }
});

// GET /api/resenas/stats - Obtener estadísticas de reseñas
router.get('/resenas/stats', async (req, res) => {
  try {
    const stats = await resenas.getEstadisticas();
    res.json(stats);
  } catch (err) {
    console.error('Error en /api/resenas/stats:', err);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// POST /api/resenas/:id/util - Incrementar contador de "me fue útil"
router.post('/resenas/:id/util', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await resenas.incrementUtil(id);
    if (result === 0) {
      return res.status(404).json({ error: 'Reseña no encontrada' });
    }
    res.json({ ok: true, mensaje: 'Contador actualizado' });
  } catch (err) {
    console.error('Error en /api/resenas/:id/util:', err);
    res.status(500).json({ error: 'Error al actualizar contador' });
  }
});

// POST /api/resenas - Crear nueva reseña
router.post('/resenas', async (req, res) => {
  const { nombre, email, calificacion, comentario, usuario_id } = req.body;

  if (!nombre || !calificacion) {
    return res.status(400).json({ error: 'Nombre y calificación son requeridos' });
  }

  if (calificacion < 1 || calificacion > 5) {
    return res.status(400).json({ error: 'La calificación debe ser entre 1 y 5' });
  }

  try {
    const id = await resenas.addReseña({ nombre, email, calificacion, comentario, usuario_id });
    res.json({ ok: true, mensaje: 'Reseña enviada correctamente. Será visible tras ser aprobada.', id });
  } catch (err) {
    console.error('Error en POST /api/resenas:', err);
    res.status(500).json({ error: 'Error al enviar reseña' });
  }
});

// GET /api/resenas/todas - Obtener todas las reseñas (admin)
router.get('/resenas/todas', async (req, res) => {
  try {
    const lista = await resenas.getAllReseñas();
    res.json(lista);
  } catch (err) {
    console.error('Error en /api/resenas/todas:', err);
    res.status(500).json({ error: 'Error al obtener reseñas' });
  }
});

// PUT /api/resenas/:id/aprobar - Aprobar reseña (admin)
router.put('/resenas/:id/aprobar', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await resenas.aprobarReseña(id);
    if (result === 0) {
      return res.status(404).json({ error: 'Reseña no encontrada' });
    }
    res.json({ ok: true, mensaje: 'Reseña aprobada' });
  } catch (err) {
    console.error('Error en aprobar reseña:', err);
    res.status(500).json({ error: 'Error al aprobar reseña' });
  }
});

// DELETE /api/resenas/:id - Eliminar reseña (admin)
router.delete('/resenas/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await resenas.eliminarReseña(id);
    if (result === 0) {
      return res.status(404).json({ error: 'Reseña no encontrada' });
    }
    res.json({ ok: true, mensaje: 'Reseña eliminada' });
  } catch (err) {
    console.error('Error en eliminar reseña:', err);
    res.status(500).json({ error: 'Error al eliminar reseña' });
  }
});

module.exports = router;
