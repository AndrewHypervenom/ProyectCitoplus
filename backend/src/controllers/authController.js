const pool = require('../config/db');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');

// Maneja la autenticación de usuarios
const login = async (req, res) => {
  const { nombre_usuario, password } = req.body;

  // Verifica credenciales contra DB - solo usuarios activos
  const userResult = await pool.query('SELECT * FROM usuarios WHERE nombre_usuario = $1 AND estado = true', [nombre_usuario]);
  const user = userResult.rows[0];
  if (!user) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });

  // Valida password con bcrypt
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });

  // Actualiza último acceso
  await pool.query('UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = $1', [user.id]);

  // Genera JWT y retorna info básica del usuario
  const token = generateToken({ id: user.id, nombre_usuario: user.nombre_usuario, rol: user.rol });
  return res.json({ token, user: { id: user.id, nombre_usuario: user.nombre_usuario, rol: user.rol } });
};


module.exports = { login };
