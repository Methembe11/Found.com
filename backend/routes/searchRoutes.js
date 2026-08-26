const express = require('express');
const router = express.Router();
const { logSearch } = require('../controllers/searchController');

router.post('/', logSearch);

module.exports = router;
