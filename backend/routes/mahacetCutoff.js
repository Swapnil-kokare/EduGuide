const express = require('express');
const { getMahacetCutoffs } = require('../controllers/mahacetCutoffController');

const router = express.Router();

// GET /api/mahacet-cutoff
router.get('/', getMahacetCutoffs);

module.exports = router;
