const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const { getStats } = require('../controllers/adminControllers');

router.get('/stats', authenticateToken, requireRole(['admin', 'Admin', 'SuperAdmin', 'Staff']), getStats);

module.exports = router;
