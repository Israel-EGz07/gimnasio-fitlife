const db = require('../db');

(async () => {
  try {
    const [usuarios] = await db.query('SELECT id, nombre, email, plan_id, created_at FROM usuarios');
    console.log('Usuarios encontrados:', usuarios.length);
    console.table(usuarios);
  } catch (err) {
    console.error('Error al consultar usuarios:', err);
  }
})();
