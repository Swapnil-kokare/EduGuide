const express = require('express');
const predictRoutes = require('./predict');
const feedbackRoutes = require('./feedback');
const collegeRoutes = require('./colleges');
const officialCollegeRoutes = require('./officialColleges');
const mahacetCutoffRoutes = require('./mahacetCutoff');

const router = express.Router();

// Mount routes
router.use('/predict', predictRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/colleges', collegeRoutes);
router.use('/official-colleges', officialCollegeRoutes);
router.use('/mahacet-cutoff', mahacetCutoffRoutes);

module.exports = router;
