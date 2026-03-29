const mongoose = require('../shared/mongoose');

const collegeSchema = new mongoose.Schema({
  instituteCode: {
    type: String,
    trim: true
  },
  choiceCode: {
    type: String,
    trim: true,
    index: true
  },
  collegeName: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  branch: {
    type: String,
    required: true,
    trim: true
  },
  categoryCutoff: {
    type: Map,
    of: {
      type: Number,
      min: 0,
      max: 100
    },
    default: {}
  },
  fees: {
    type: Number,
    default: 0,
    min: 0
  },
  type: {
    type: String,
    trim: true
  },
  sourceRound: {
    type: String,
    trim: true
  },
  sourceUrl: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('College', collegeSchema);
