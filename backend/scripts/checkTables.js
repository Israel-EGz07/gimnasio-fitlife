const db = require('../db');

(async () => {
  try {
    const [rows] = await db.query("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('Tablas en la base de datos:', rows.map(r => r.name));
  } catch (err) {
    console.error('Error al consultar tablas:', err);
  }
})();
