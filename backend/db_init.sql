-- Archivo de referencia para el esquema (SQLite). No es necesario ejecutarlo manualmente.

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  plan_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de planes
CREATE TABLE IF NOT EXISTS planes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio REAL NOT NULL
);

-- Tabla de registros (logs de actividad)
CREATE TABLE IF NOT EXISTS registros (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  email TEXT,
  accion TEXT NOT NULL,
  detalle TEXT,
  creado_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de suscripciones (inscripciones a planes)
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
