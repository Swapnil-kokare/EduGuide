const express = require('express');
const { getOfficialColleges } = require('../controllers/officialCollegeController');

const router = express.Router();

// GET /api/official-colleges
router.get('/', getOfficialColleges);

module.exports = router;
