const { validationResult } = require('express-validator');
const College = require('../../database/models/College');

const getAllColleges = async (req, res) => {
    try {
        const colleges = await College.find({}).sort({ collegeName: 1 });

        res.status(200).json({
            success: true,
            data: colleges,
            count: colleges.length
        });
    } catch (error) {
        console.error('Get colleges error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const createCollege = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { collegeName, city, branch, categoryCutoff, fees } = req.body;

        const college = new College({
            collegeName,
            city,
            branch,
            categoryCutoff,
            fees
        });

        await college.save();

        res.status(201).json({
            success: true,
            message: 'College created successfully',
            data: college
        });
    } catch (error) {
        console.error('Create college error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    getAllColleges,
    createCollege
};
