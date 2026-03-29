const OfficialCollege = require('../../database/models/OfficialCollege');

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildExactRegex(value) {
  return new RegExp(`^${escapeRegex(value.trim())}$`, 'i');
}

const getOfficialColleges = async (req, res) => {
  try {
    const {
      instituteCode,
      district,
      region,
      courseName,
      search,
      page = '1',
      limit = '100',
    } = req.query;

    const query = {};

    if (instituteCode) {
      query.instituteCode = instituteCode.trim();
    }

    if (district) {
      query.district = buildExactRegex(district);
    }

    if (region) {
      query.region = buildExactRegex(region);
    }

    if (courseName) {
      query.courseName = new RegExp(escapeRegex(courseName.trim()), 'i');
    }

    if (search) {
      const searchRegex = new RegExp(escapeRegex(search.trim()), 'i');
      query.$or = [
        { instituteName: searchRegex },
        { courseName: searchRegex },
        { district: searchRegex },
        { region: searchRegex },
        { choiceCode: searchRegex },
      ];
    }

    const parsedPage = Math.max(Number.parseInt(page, 10) || 1, 1);
    const parsedLimit = Math.min(Math.max(Number.parseInt(limit, 10) || 100, 1), 500);
    const skip = (parsedPage - 1) * parsedLimit;

    const [records, total] = await Promise.all([
      OfficialCollege.find(query)
        .sort({ instituteName: 1, courseName: 1, choiceCode: 1 })
        .skip(skip)
        .limit(parsedLimit),
      OfficialCollege.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: records,
      count: records.length,
      total,
      page: parsedPage,
      limit: parsedLimit,
    });
  } catch (error) {
    console.error('Get official colleges error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = {
  getOfficialColleges,
};
