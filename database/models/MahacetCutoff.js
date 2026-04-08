const mongoose = require('mongoose');

const mahacetCutoffSchema = new mongoose.Schema(
    {},
    { strict: false, collection: 'cutoff', timestamps: true }
);

module.exports = mongoose.model('MahacetCutoff', mahacetCutoffSchema);
