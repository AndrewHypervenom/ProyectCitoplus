const pool = require('../config/db');

// Lista visitantes con filtros dinámicos
const listVisitors = async (req, res) => {
  const { nombre, numero_identificacion, fecha } = req.query;
  let query = 'SELECT * FROM visitantes WHERE 1=1';
  const params = [];

  // Construye query dinámicamente según filtros
  if (nombre) {
    params.push(`%${nombre}%`);
    query += ` AND nombre ILIKE $${params.length}`;
  }
  if (numero_identificacion) {
    params.push(`%${numero_identificacion}%`);
    query += ` AND numero_identificacion ILIKE $${params.length}`;
  }
  if (fecha) {
    params.push(fecha);
    query += ` AND DATE(fecha_visita) = $${params.length}`;
  }

  query += ' ORDER BY id ASC';

  try {
    const result = await pool.query(query, params);
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Registra nuevo visitante
const createVisitor = async (req, res) => {
  const { nombre, numero_identificacion, motivo, estado } = req.body;
  const userId = req.user.id; // ID del usuario que registra

  try {
    const result = await pool.query(`
      INSERT INTO visitantes (nombre, numero_identificacion, motivo, creado_por, estado)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `,
    [nombre, numero_identificacion, motivo, userId, estado || 'sin_confirmar']);
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualiza estado de visita y gestiona fecha_salida
const updateVisitorStatus = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  // Definir qué estados deben marcar fecha_salida
  const estadosFinales = ['finalizado', 'cancelado', 'rechazado', 'expirado'];

  let query;
  let params;

  if (estadosFinales.includes(estado)) {
    // Si es un estado final, ponemos fecha_salida = NOW()
    query = 'UPDATE visitantes SET estado = $1, fecha_salida = NOW() WHERE id = $2 RETURNING *';
    params = [estado, id];
  } else {
    // Si no es final, limpiamos la fecha_salida (NULL) en caso de que haya estado final antes
    query = 'UPDATE visitantes SET estado = $1, fecha_salida = NULL WHERE id = $2 RETURNING *';
    params = [estado, id];
  }

  try {
    const result = await pool.query(query, params);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Visitante no encontrado' });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { listVisitors, createVisitor, updateVisitorStatus };
