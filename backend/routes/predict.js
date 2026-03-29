const express = require('express');
const { body } = require('express-validator');
const { predictColleges } = require('../controllers/predictController');
const { resolvePredictionCategory } = require('../services/predictionLogic');

const router = express.Router();

// POST /api/predict
router.post('/',
    [
        body('score')
            .isFloat({ min: 0, max: 100 })
            .withMessage('Score must be a number between 0 and 100'),
        body('category')
            .custom((value) => Boolean(resolvePredictionCategory(value)))
            .withMessage('Category must be one of the supported CET Cell categories'),
        body('branch')
            .isString()
            .notEmpty()
            .withMessage('Branch is required'),
        body('examType')
            .optional()
            .isIn(['MHT-CET', 'JEE'])
            .withMessage('Exam type must be MHT-CET or JEE'),
        body('collegeType')
            .optional()
            .isIn(['Any', 'Government', 'Private'])
            .withMessage('College type must be Any, Government, or Private'),
        body('city')
            .optional()
            .isString()
            .withMessage('City must be a string')
    ],
    predictColleges
);

module.exports = router;
