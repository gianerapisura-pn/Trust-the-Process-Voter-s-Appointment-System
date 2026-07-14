const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authControllers');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.post('/register', authenticateToken, requireRole(['admin', 'Admin', 'SuperAdmin']), register);

router.post('/login', login);

module.exports = router;
