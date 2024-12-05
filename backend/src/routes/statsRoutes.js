const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// Ruta estadísticas - requiere auth
router.get('/', auth, async (req, res) => {
  try {
    // Stats usuarios activos/inactivos
    const userStats = await pool.query(`
      SELECT 
        SUM(CASE WHEN estado = true THEN 1 ELSE 0 END) AS activos,
        SUM(CASE WHEN estado = false THEN 1 ELSE 0 END) AS inactivos
      FROM usuarios
    `);

    // Stats visitantes por estado
    const visitorStates = await pool.query(`
      SELECT estado, COUNT(*) as count
      FROM visitantes
      GROUP BY estado
    `);

    // Histórico 30 días
    const visitorsPerDay = await pool.query(`
      SELECT DATE(fecha_visita) as fecha, COUNT(*) as count
      FROM visitantes
      WHERE fecha_visita >= NOW() - INTERVAL '30 days'
      GROUP BY fecha
      ORDER BY fecha
    `);

    // Stats por usuario
    const visitorsPerUser = await pool.query(`
      SELECT u.nombre_usuario, COUNT(v.id) as count
      FROM usuarios u
      LEFT JOIN visitantes v ON u.id = v.creado_por
      GROUP BY u.id, u.nombre_usuario
      ORDER BY count DESC
    `);

    // Duración promedio de visitas (en minutos)
    const avgVisitDuration = await pool.query(`
      SELECT AVG(EXTRACT(EPOCH FROM (fecha_salida - fecha_visita))/60) as avg_duration
      FROM visitantes
      WHERE fecha_salida IS NOT NULL
    `);

    // Top 5 motivos
    const visitorsByMotivo = await pool.query(`
      SELECT motivo, COUNT(*) as count
      FROM visitantes
      GROUP BY motivo
      ORDER BY count DESC
      LIMIT 5
    `);

    // Stats por día semana
    const visitorsByWeekday = await pool.query(`
      SELECT TO_CHAR(fecha_visita, 'Day') as day, COUNT(*) as count
      FROM visitantes
      GROUP BY day
      ORDER BY count DESC
    `);

    // Usuarios nuevos últimos 6 meses
    const newUsersPerMonth = await pool.query(`
      SELECT TO_CHAR(fecha_creacion, 'YYYY-MM') as mes, COUNT(*) as count
      FROM usuarios
      WHERE fecha_creacion >= NOW() - INTERVAL '6 months'
      GROUP BY mes
      ORDER BY mes
    `);

    res.json({
      users: userStats.rows[0],
      visitors: visitorStates.rows,
      visitorsPerDay: visitorsPerDay.rows,
      visitorsPerUser: visitorsPerUser.rows,
      avgVisitDuration: avgVisitDuration.rows[0].avg_duration,
      visitorsByMotivo: visitorsByMotivo.rows,
      visitorsByWeekday: visitorsByWeekday.rows,
      newUsersPerMonth: newUsersPerMonth.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
