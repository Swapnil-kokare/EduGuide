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

        const { score, category, branch, city, examType, collegeType } = req.body;

        console.log('Prediction request:', { score, category, branch, city, examType, collegeType });

        const colleges = await PredictionService.predictColleges(
            score,
            category,
            branch,
            city,
            examType,
            collegeType
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
