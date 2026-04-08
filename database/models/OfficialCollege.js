const mongoose = require('mongoose');

const officialCollegeSchema = new mongoose.Schema(
    {
        college_code: String,
        college_name: String,
        university: String,
        district: String,
        categories: mongoose.Schema.Types.Mixed,
    },
    { timestamps: true }
);

module.exports = mongoose.model('OfficialCollege', officialCollegeSchema);
