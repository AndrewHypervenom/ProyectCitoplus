const pool = require('../config/db');
const bcrypt = require('bcrypt');

// Crea nuevo usuario en el sistema
// Solo accesible por admin
const createUser = async (req, res) => {
  const { nombre_usuario, password } = req.body;
  
  try {
    // Hash del password antes de guardar
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(`
      INSERT INTO usuarios (nombre_usuario, password) 
      VALUES ($1, $2) RETURNING id, nombre_usuario, fecha_creacion, estado`, [nombre_usuario, hash]);
    
    return res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    // Manejo específico para violación de unique constraint
    if (error.code === '23505') {
      return res.status(409).json({ error: 'El usuario ya existe' });
    }
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Lista usuarios registrados
// Excluye passwords por seguridad
const listUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre_usuario, fecha_creacion, estado FROM usuarios');
    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Toggle estado usuario (activo/inactivo)
const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  try {
    await pool.query('UPDATE usuarios SET estado = $1 WHERE id = $2', [estado, id]);
    return res.json({ message: 'Estado de usuario actualizado' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Elimina usuario si no tiene dependencias
// Protege al admin (id=1) de eliminación
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    // Verificar que no sea el usuario admin (id 1)
    if (id === '1') {
      return res.status(403).json({ error: 'No se puede eliminar al usuario administrador' });
    }
    
    // Verificar si el usuario tiene visitantes asociados
    const visitorCheck = await pool.query(
      'SELECT COUNT(*) FROM visitantes WHERE creado_por = $1',
      [id]
    );
    
    if (visitorCheck.rows[0].count > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar el usuario porque tiene visitantes asociados' 
      });
    }

    const result = await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    return res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { createUser, listUsers, updateUserStatus, deleteUser };
