const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { listSites, createSite, updateSite, deleteSite } = require('../controllers/siteControllers');

router.get('/', listSites);
router.post('/', authenticateToken, createSite);
router.put('/:id', authenticateToken, updateSite);
router.delete('/:id', authenticateToken, deleteSite);

module.exports = router;
