// Configuración de SQLite para el backend
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_FILE = path.join(__dirname, 'data', 'gimnasio.sqlite');

let dbPromise;

async function init() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const db = new sqlite3.Database(DB_FILE, err => {
      if (err) return reject(err);

      db.serialize(() => {
        db.run(`
          CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            plan_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );
        `);

        db.run(`
          CREATE TABLE IF NOT EXISTS planes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            descripcion TEXT,
            precio REAL NOT NULL
          );
        `);

        db.run(`
          CREATE TABLE IF NOT EXISTS registros (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            email TEXT,
            accion TEXT NOT NULL,
            detalle TEXT,
            creado_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );
        `);

        db.run(`
          CREATE TABLE IF NOT EXISTS suscripciones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            email TEXT,
            plan_id INTEGER,
            plan_nombre TEXT,
            monto REAL,
            fecha_inicio TEXT,
            creado_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );
        `);

        db.run(`
          CREATE TABLE IF NOT EXISTS reseñas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            email TEXT,
            calificacion INTEGER NOT NULL CHECK(calificacion >= 1 AND calificacion <= 5),
            comentario TEXT,
            aprobado INTEGER DEFAULT 0,
            creado_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );
        `, (runErr) => {
          if (runErr) return reject(runErr);

          // Semilla inicial de planes: siempre verificar que existan los planes base
        const defaultPlans = [
          { nombre: 'Básico', descripcion: 'Acceso al gimnasio en horario libre', precio: 299.99 },
          { nombre: 'Premium', descripcion: 'Incluye clases grupales y sauna', precio: 499.99 },
          { nombre: 'VIP', descripcion: 'Entrenador personal y acceso 24/7', precio: 799.99 }
        ];

        // Verificar y agregar cada plan si no existe
        const checkAndInsertPlans = (index) => {
          if (index >= defaultPlans.length) {
            return resolve(db);
          }
          const plan = defaultPlans[index];
          db.get('SELECT id FROM planes WHERE nombre = ?', [plan.nombre], (err, row) => {
            if (err) return reject(err);
            if (!row) {
              db.run('INSERT INTO planes (nombre, descripcion, precio) VALUES (?, ?, ?)',
                [plan.nombre, plan.descripcion, plan.precio], (insertErr) => {
                  if (insertErr) return reject(insertErr);
                  checkAndInsertPlans(index + 1);
                });
            } else {
              checkAndInsertPlans(index + 1);
            }
          });
        };
        checkAndInsertPlans(0);
        });
      });
    });
  });

  return dbPromise;
}

function query(sql, params = []) {
  // Previene inyección SQL básica: no permitir múltiples sentencias ni comentarios.
  const cleanSql = sql.trim();
  // Quita el ; final para que no bloquee consultas terminadas en punto y coma.
  const normalized = cleanSql.replace(/;\s*$/, '');

  if (/--|\/\*/.test(normalized)) {
    return Promise.reject(new Error('SQL inválida: no se permiten comentarios en la consulta.'));
  }
  if ((normalized.match(/;/g) || []).length > 1) {
    return Promise.reject(new Error('SQL inválida: múltiple statements no permitidos.'));
  }

  return new Promise((resolve, reject) => {
    init().then(db => {
      const trimmed = normalized.toLowerCase();
      if (trimmed.startsWith('select')) {
        db.all(normalized, params, (err, rows) => {
          if (err) return reject(err);
          resolve([rows]);
        });
      } else {
        db.run(normalized, params, function (err) {
          if (err) return reject(err);
          resolve([{ insertId: this.lastID, affectedRows: this.changes }]);
        });
      }
    }).catch(reject);
  });
}

module.exports = { query };
