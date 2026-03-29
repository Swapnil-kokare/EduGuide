const College = require('../../database/models/College');
const {
    buildExactCaseInsensitiveRegex,
    calculateMatchMetrics,
    comparePredictions,
    inferCollegeType,
    normalizeCollegeType,
    resolvePredictionCategory,
    toEffectivePercentile,
} = require('./predictionLogic');

class PredictionService {
    static async predictColleges(score, category, branch, city, examType, collegeType) {
        try {
            const resolvedCategory = resolvePredictionCategory(category);
            const normalizedCollegeType = normalizeCollegeType(collegeType);
            const effectivePercentile = toEffectivePercentile(score, examType);

            if (!resolvedCategory) {
                throw new Error(`Unsupported category: ${category}`);
            }

            if (effectivePercentile === null) {
                throw new Error('A valid percentile is required');
            }

            const query = {
                branch: buildExactCaseInsensitiveRegex(branch),
                [`categoryCutoff.${resolvedCategory}`]: {
                    $lte: Math.min(effectivePercentile, 100),
                },
            };

            if (city && city !== 'all' && city !== 'Any') {
                query.city = buildExactCaseInsensitiveRegex(city);
            }

            const colleges = await College.find(query).lean();

            const predictedColleges = colleges
                .map((college) => {
                    const inferredType = inferCollegeType(college);
                    const cutoff = college.categoryCutoff?.[resolvedCategory];
                    const metrics = calculateMatchMetrics(effectivePercentile, cutoff);

                    return {
                        ...college,
                        type: inferredType,
                        requestedCategory: category,
                        selectedCategory: resolvedCategory,
                        effectivePercentile: Number(effectivePercentile.toFixed(2)),
                        ...metrics,
                    };
                })
                .filter((college) => {
                    if (normalizedCollegeType === 'Any') {
                        return true;
                    }

                    return college.type === normalizedCollegeType;
                })
                .sort(comparePredictions)
                .slice(0, 20);

            return predictedColleges;
        } catch (error) {
            throw new Error('Error predicting colleges: ' + error.message);
        }
    }
}

module.exports = PredictionService;
