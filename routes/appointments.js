const express = require('express');
const router = express.Router();
const { authenticateToken, optionalAuth, requireRole } = require('../middleware/auth');
const {
  listAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  updateStatus,
  deleteAppointment,
} = require('../controllers/appointmentsControllers');

router.get('/', optionalAuth, listAppointments);

router.get('/:id', authenticateToken, getAppointment);

router.post('/', createAppointment);

router.put('/:id', authenticateToken, updateAppointment);

router.put('/:id/status', authenticateToken, requireRole(['admin', 'Admin', 'SuperAdmin', 'Staff']), updateStatus);

router.delete('/:id', authenticateToken, deleteAppointment);

module.exports = router;
