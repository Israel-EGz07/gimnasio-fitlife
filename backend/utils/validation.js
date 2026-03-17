// Validaciones simples para entradas de API

function isEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

module.exports = { isEmail, isNonEmptyString, isPositiveInteger };
