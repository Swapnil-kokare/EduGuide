const express = require('express');
const predictRoutes = require('./predict');
const feedbackRoutes = require('./feedback');
const mahacetCutoffRoutes = require('./mahacetCutoff');

const router = express.Router();

// Mount routes
router.use('/predict', predictRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/mahacet-cutoff', mahacetCutoffRoutes);

module.exports = router;
