const express = require('express');
const { login } = require('../controllers/authController');
const router = express.Router();

// Ruta de auth - login
router.post('/login', login);

module.exports = router;
