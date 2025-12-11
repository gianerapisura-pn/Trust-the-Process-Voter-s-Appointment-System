const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { listSlots, createSlot, updateSlot, deleteSlot } = require('../controllers/slotControllers');

router.get('/', listSlots);
router.post('/', authenticateToken, createSlot);
router.put('/:id', authenticateToken, updateSlot);
router.delete('/:id', authenticateToken, deleteSlot);

module.exports = router;
