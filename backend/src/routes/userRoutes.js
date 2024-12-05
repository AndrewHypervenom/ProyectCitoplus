const express = require('express');
const router = express.Router();
const { listUsers, createUser, updateUserStatus, deleteUser } = require('../controllers/userController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Rutas protegidas solo para admin
router.get('/', auth, isAdmin, listUsers);              // Lista usuarios
router.post('/', auth, isAdmin, createUser);            // Crea usuario
router.patch('/:id', auth, isAdmin, updateUserStatus);  // Actualiza estado
router.delete('/:id', auth, isAdmin, deleteUser);       // Elimina usuario

module.exports = router;