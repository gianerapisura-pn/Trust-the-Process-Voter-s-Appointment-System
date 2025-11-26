const express = require('express');
const router = express.Router();
const { getAllVoters, getVoter, createVoter, updateVoter, deleteVoter } = require('../controllers/votersControllers');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, getAllVoters);
router.get('/:id', authenticateToken, getVoter);
router.post('/', createVoter); 
router.put('/:id', authenticateToken, updateVoter);
router.delete('/:id', authenticateToken, deleteVoter);

module.exports = router;