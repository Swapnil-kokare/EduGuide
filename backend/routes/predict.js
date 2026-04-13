const express = require('express');
const { body } = require('express-validator');
const { predictColleges } = require('../controllers/predictController');

const router = express.Router();

// POST /api/predict
router.post('/',
    [
        body('percentile')
            .isFloat({ min: 0, max: 100 })
            .withMessage('Percentile must be a number between 0 and 100'),
        body('category')
            .isString()
            .withMessage('Category must be a string'),
        body('branches')
            .isArray()
            .withMessage('Branches must be an array'),
        body('cities')
            .optional()
            .isArray()
            .withMessage('Cities must be an array'),
        body('collegeTypes')
            .optional()
            .isArray()
            .withMessage('College types must be an array'),
        body('examType')
            .optional()
            .isIn(['MHT-CET', 'JEE'])
            .withMessage('Exam type must be MHT-CET or JEE'),
        body('gender')
            .optional()
            .isIn(['Male', 'Female'])
            .withMessage('Gender must be Male or Female')
    ],
    predictColleges
);

module.exports = router;
