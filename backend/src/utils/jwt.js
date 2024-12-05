const jwt = require('jsonwebtoken');
require('dotenv').config();

// Genera token JWT con payload
function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
}

// Verifica y decodifica token
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { generateToken, verifyToken };
