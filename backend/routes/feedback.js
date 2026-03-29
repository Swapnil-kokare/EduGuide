const express = require('express');
const { body } = require('express-validator');
const { createFeedback } = require('../controllers/feedbackController');

const router = express.Router();

// POST /api/feedback
router.post('/',
    [
        body('rating')
            .isInt({ min: 1, max: 5 })
            .withMessage('Rating must be an integer between 1 and 5'),
        body('message')
            .isString()
            .isLength({ min: 1 })
            .withMessage('Message is required and must be a string')
    ],
    createFeedback
);

module.exports = router;