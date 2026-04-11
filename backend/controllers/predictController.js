const { validationResult } = require('express-validator');
const PredictionService = require('../services/predictionService');

const predictColleges = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { percentile, category, branches, cities, collegeTypes } = req.body;

        console.log('Prediction request:', { percentile, category, branches, cities, collegeTypes });

        const colleges = await PredictionService.predictColleges(
            percentile,
            category,
            branches,
            cities,
            collegeTypes
        );

        console.log(`Prediction returned ${colleges.length} results`);

        res.status(200).json({
            success: true,
            data: colleges,
            count: colleges.length
        });
    } catch (error) {
        console.error('Prediction error:', error.message, error.stack);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

module.exports = {
    predictColleges
};
