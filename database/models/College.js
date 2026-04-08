const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema(
    {
        college_name: {
            type: String,
            required: true,
        },
        location: String,
        handicap_score: Number,
        general_score: Number,
        obc_score: Number,
        sc_score: Number,
        st_score: Number,
        ews_score: Number,
    },
    { timestamps: true }
);

module.exports = mongoose.model('College', collegeSchema);
