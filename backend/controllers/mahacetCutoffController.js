const MahacetCutoff = require('../../database/models/MahacetCutoff');

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const getMahacetCutoffs = async (req, res) => {
    try {
        const { college_code, college_name, branch, search, page = '1', limit = '20' } = req.query;
        const query = {};

        if (college_code) {
            query.college_code = String(college_code).trim();
        }

        if (college_name) {
            query.college_name = new RegExp(escapeRegex(String(college_name).trim()), 'i');
        }

        if (branch) {
            query.branches = new RegExp(escapeRegex(String(branch).trim()), 'i');
        }

        if (search) {
            const regex = new RegExp(escapeRegex(String(search).trim()), 'i');
            query.$or = [
                { college_name: regex },
                { college_code: regex },
                { branches: regex }
            ];
        }

        const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
        const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
        const skip = (parsedPage - 1) * parsedLimit;

        const [data, total] = await Promise.all([
            MahacetCutoff.find(query).skip(skip).limit(parsedLimit).lean(),
            MahacetCutoff.countDocuments(query)
        ]);

        res.status(200).json({
            success: true,
            data,
            count: data.length,
            total,
            page: parsedPage,
            limit: parsedLimit
        });
    } catch (error) {
        console.error('Mahacet cutoff query error:', error);
        res.status(500).json({
            success: false,
            message: 'Unable to fetch cutoff data'
        });
    }
};

module.exports = {
    getMahacetCutoffs
};
