const MahacetCutoff = require('../../database/models/MahacetCutoff');
const SUPPORTED_CATEGORIES = [
    'OPEN', 'EWS', 'OBC', 'DT_VJ', 'NT1', 'NT2', 'NT3', 'SBC', 'SEBC', 'SC', 'ST'
];

/**
 * GET /api/meta/categories
 * Returns the list of supported CET reservation categories.
 */
const getCategories = async (req, res) => {
    try {
        const categoryLabels = {
            OPEN: 'Open',
            EWS: 'EWS',
            OBC: 'OBC',
            DT_VJ: 'DT/VJ',
            NT1: 'NT 1 (NT-B)',
            NT2: 'NT 2 (NT-C)',
            NT3: 'NT 3 (NT-D)',
            SBC: 'SBC',
            SEBC: 'SEBC',
            SC: 'SC',
            ST: 'ST',
        };

        const categories = SUPPORTED_CATEGORIES.map((key) => ({
            label: categoryLabels[key] || key,
            apiValue: key,
        }));

        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        console.error('Meta categories error:', error);
        res.status(500).json({ success: false, message: 'Unable to fetch categories' });
    }
};

/**
 * GET /api/meta/branches
 * Scans the cutoff collection and returns distinct branch/course names.
 */
const getBranches = async (req, res) => {
    try {
        // Each cutoff document has a `branches` array with objects containing `course_name`
        const results = await MahacetCutoff.aggregate([
            { $unwind: '$branches' },
            { $group: { _id: '$branches.course_name' } },
            { $match: { _id: { $ne: null } } },
            { $sort: { _id: 1 } },
        ]);

        const branches = results
            .map((r) => r._id)
            .filter((v) => typeof v === 'string' && v.trim().length > 0);

        res.status(200).json({ success: true, data: branches });
    } catch (error) {
        console.error('Meta branches error:', error);
        res.status(500).json({ success: false, message: 'Unable to fetch branches' });
    }
};

/**
 * GET /api/meta/cities
 * Scans the cutoff collection and returns distinct city/district names.
 * Falls back to extracting city from college_name if no explicit field exists.
 */
const getCities = async (req, res) => {
    try {
        // First try to use an explicit location / district / city field
        let results = await MahacetCutoff.aggregate([
            {
                $project: {
                    city: {
                        $ifNull: [
                            '$location',
                            {
                                $ifNull: [
                                    '$district',
                                    {
                                        $ifNull: [
                                            '$city',
                                            {
                                                // Fallback: extract after last comma in college_name
                                                $trim: {
                                                    input: {
                                                        $arrayElemAt: [
                                                            { $split: [{ $ifNull: ['$college_name', ''] }, ','] },
                                                            -1,
                                                        ],
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                },
            },
            { $match: { city: { $ne: '' } } },
            { $group: { _id: '$city' } },
            { $sort: { _id: 1 } },
        ]);

        const cities = results
            .map((r) => {
                const c = r._id;
                if (c && typeof c === 'object') {
                    return c.city || c.district || c.region || '';
                }
                return c;
            })
            .filter((v) => typeof v === 'string' && v.trim().length > 0);

        // Deduplicate after possible mapping overlaps
        const uniqueCities = [...new Set(cities)];

        res.status(200).json({ success: true, data: uniqueCities });
    } catch (error) {
        console.error('Meta cities error:', error);
        res.status(500).json({ success: false, message: 'Unable to fetch cities' });
    }
};

module.exports = {
    getCategories,
    getBranches,
    getCities,
};
