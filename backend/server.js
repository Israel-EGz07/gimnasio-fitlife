const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const infoRoutes = require('./routes/info');
const plansRoutes = require('./routes/plans');
const usersRoutes = require('./routes/users');
const subscriptionsRoutes = require('./routes/subscriptions');
const statsRoutes = require('./routes/stats');
const resenasRoutes = require('./routes/resenas');
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', infoRoutes);
app.use('/api', plansRoutes);
app.use('/api', usersRoutes);
app.use('/api', subscriptionsRoutes);
app.use('/api', statsRoutes);
app.use('/api', resenasRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
});
