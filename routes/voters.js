const express = require('express');
const router = express.Router();
const { getAllVoters, getVoter, createVoter, updateVoter, deleteVoter } = require('../controllers/votersControllers');
const { authenticateToken } = require('../middleware/auth');

// Public route to create voter and appointment
router.post('/', createVoter);

// Secure routes
router.get('/', authenticateToken, getAllVoters);
router.get('/:id', authenticateToken, getVoter);
router.put('/:id', authenticateToken, updateVoter);
router.delete('/:id', authenticateToken, deleteVoter);

module.exports = router;
