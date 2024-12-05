const express = require('express');
const { listVisitors, createVisitor, updateVisitorStatus } = require('../controllers/visitorController');
const auth = require('../middleware/auth');

const router = express.Router();

// Rutas protegidas para admin y usuario
router.get('/', auth, listVisitors);                        // Lista/filtra visitantes
router.post('/', auth, createVisitor);                      // Registra visitante
router.patch('/:id/estado', auth, updateVisitorStatus);     // Actualiza estado

module.exports = router;