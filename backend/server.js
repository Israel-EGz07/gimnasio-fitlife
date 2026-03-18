const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const infoRoutes = require('./routes/info');
const plansRoutes = require('./routes/plans');
const usersRoutes = require('./routes/users');
const subscriptionsRoutes = require('./routes/subscriptions');
const statsRoutes = require('./routes/stats');
const resenasRoutes = require('./routes/resenas');

// DEBUG: Verificar que los módulos de rutas se cargaron
console.log('[DEBUG] usersRoutes cargado:', typeof usersRoutes, usersRoutes ? 'OK' : 'UNDEFINED');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', infoRoutes);
app.use('/api', plansRoutes);
app.use('/api', usersRoutes);
app.use('/api', subscriptionsRoutes);
app.use('/api', statsRoutes);
app.use('/api', resenasRoutes);

// Favicon fallback - evitar error 404
app.get('/favicon.ico', (req, res) => res.status(204).end());

// DEBUG: Listar todas las rutas registradas
console.log('[DEBUG] Rutas registradas en /api:');
app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(`  - ${Object.keys(middleware.route.methods).join(',')} ${middleware.route.path}`);
  } else if (middleware.name === 'router') {
    console.log('  [Sub-router montado]');
    middleware.handle.stack.forEach((handler) => {
      if (handler.route) {
        const methods = Object.keys(handler.route.methods).join(',').toUpperCase();
        console.log(`    ${methods} ${handler.route.path}`);
      }
    });
  }
});

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'public')));

// Ruta raíz sirve el frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
});
