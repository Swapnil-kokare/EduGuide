const mongoose = require('../shared/mongoose');

const officialCollegeSchema = new mongoose.Schema(
  {
    instituteCode: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    instituteName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    instituteAddress: {
      type: String,
      trim: true,
    },
    region: {
      type: String,
      trim: true,
      index: true,
    },
    district: {
      type: String,
      trim: true,
      index: true,
    },
    instituteStatus: {
      type: String,
      trim: true,
    },
    autonomyStatus: {
      type: String,
      trim: true,
    },
    minorityStatus: {
      type: String,
      trim: true,
    },
    publicRemark: {
      type: String,
      trim: true,
    },
    instituteTotalIntake: {
      type: Number,
      min: 0,
    },
    choiceCode: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    courseName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    university: {
      type: String,
      trim: true,
    },
    courseStatus: {
      type: String,
      trim: true,
    },
    courseAutonomyStatus: {
      type: String,
      trim: true,
    },
    courseMinorityStatus: {
      type: String,
      trim: true,
    },
    shift: {
      type: String,
      trim: true,
    },
    accreditation: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
    },
    courseIntake: {
      type: Number,
      min: 0,
    },
    sourceSite: {
      type: String,
      required: true,
      trim: true,
    },
    sourceProgram: {
      type: String,
      required: true,
      trim: true,
    },
    academicYear: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    sourceUrl: {
      type: String,
      required: true,
      trim: true,
    },
    importedAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

officialCollegeSchema.index({ instituteCode: 1, courseName: 1 });

module.exports = mongoose.model('OfficialCollege', officialCollegeSchema);
