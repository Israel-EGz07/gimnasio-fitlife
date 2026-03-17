const express = require('express');
const router = express.Router();

// Info principal del gimnasio
router.get('/info', (req, res) => {
  res.json({
    nombre: "Gimnasio FitLife",
    descripcion: "El mejor gimnasio de la ciudad. Equipos modernos, clases grupales y entrenadores profesionales.",
    ubicacion: "Calle Principal 123, Ciudad",
    contacto: "contacto@gimnasiofitlife.com",
    telefono: "+1 (555) 123-4567",
    horario: "Lunes a Viernes: 6:00 AM - 10:00 PM\nSábados: 8:00 AM - 8:00 PM\nDomingos: 10:00 AM - 6:00 PM",
    imagenHero: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
    imagenLogo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    testimonios: [
      { nombre: "Ana López", comentario: "¡Excelente gimnasio! Los entrenadores son geniales y las instalaciones impecables.", imagen: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" },
      { nombre: "Carlos García", comentario: "He perdido 10kg en 3 meses. Recomiendo FitLife a todos.", imagen: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" },
      { nombre: "María Rodríguez", comentario: "Las clases grupales son divertidas y motivadoras. ¡Volveré!", imagen: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" }
    ]
  });
});

module.exports = router;