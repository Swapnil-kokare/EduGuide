const express = require('express');
const predictRoutes = require('./predict');
const feedbackRoutes = require('./feedback');
const mahacetCutoffRoutes = require('./mahacetCutoff');
const metaRoutes = require('./meta');

const router = express.Router();

// Mount routes
router.use('/predict', predictRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/mahacet-cutoff', mahacetCutoffRoutes);
router.use('/meta', metaRoutes);

module.exports = router;
