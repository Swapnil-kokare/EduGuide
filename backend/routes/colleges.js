const express = require('express');
const { body } = require('express-validator');
const { getAllColleges, createCollege } = require('../controllers/collegeController');

const router = express.Router();

// GET /api/colleges
router.get('/', getAllColleges);

// POST /api/colleges
router.post('/',
    [
        body('collegeName')
            .isString()
            .notEmpty()
            .withMessage('College name is required'),
        body('city')
            .isString()
            .notEmpty()
            .withMessage('City is required'),
        body('branch')
            .isString()
            .notEmpty()
            .withMessage('Branch is required'),
        body('categoryCutoff')
            .isObject()
            .withMessage('Category cutoff must be an object'),
        body('fees')
            .isFloat({ min: 0 })
            .withMessage('Fees must be a positive number')
    ],
    createCollege
);

module.exports = router;
