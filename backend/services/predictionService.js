const MahacetCutoff = require('../../database/models/MahacetCutoff');
const {
    buildExactCaseInsensitiveRegex,
    calculateMatchMetrics,
    comparePredictions,
    inferCollegeType,
    normalizeCollegeType,
    resolvePredictionCategory,
    getCutoffCategoryKey,
    toEffectivePercentile,
} = require('./predictionLogic');

class PredictionService {
    static async predictColleges(score, category, branch, city, examType, collegeType) {
        try {
            const resolvedCategory = resolvePredictionCategory(category);
            const cutoffCategoryKey = getCutoffCategoryKey(resolvedCategory);
            const normalizedCollegeType = normalizeCollegeType(collegeType);
            const effectivePercentile = toEffectivePercentile(score, examType);

            if (!resolvedCategory || !cutoffCategoryKey) {
                throw new Error(`Unsupported category: ${category}`);
            }

            if (effectivePercentile === null) {
                throw new Error('A valid percentile is required');
            }

            const escapeRegex = (value) => String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const branchRegex = new RegExp(escapeRegex(branch.trim()), 'i');
            const rawResults = await MahacetCutoff.find({
                'branches.course_name': branchRegex,
            }).lean();

            const predictedColleges = [];

            for (const college of rawResults) {
                if (!Array.isArray(college.branches)) {
                    continue;
                }

                for (const branchItem of college.branches) {
                    if (!branchRegex.test(branchItem.course_name || '')) {
                        continue;
                    }

                    const cutoffData = Array.isArray(branchItem.cutoffs)
                        ? branchItem.cutoffs.find((entry) =>
                            String(entry.section || '').toLowerCase().includes('state') &&
                            String(entry.stage || '').toLowerCase() === 'i'
                        ) || branchItem.cutoffs[0]
                        : null;

                    const categoryInfo = cutoffData?.categories?.[cutoffCategoryKey];
                    const cutoff = categoryInfo?.percentile ?? 0;
                    const metrics = calculateMatchMetrics(effectivePercentile, cutoff);

                    const collegeName = college.college_name || college.collegeName || '';
                    const inferredType = inferCollegeType({ collegeName, branch: branchItem.course_name });
                    const collegeCity = city && city !== 'Any' && city !== 'all'
                        ? city
                        : (collegeName.split(',').pop() || '').trim();

                    const result = {
                        _id: `${college._id}-${branchItem.course_code || branchItem.course_name}`,
                        collegeName,
                        city: collegeCity,
                        branch: branchItem.course_name || '',
                        categoryCutoff: { [resolvedCategory]: cutoff },
                        cutoffUsed: cutoff,
                        type: inferredType,
                        rating: college.rating || 4.0,
                        fees: college.fees || null,
                        matchPercent: metrics.matchPercent,
                        matchBand: metrics.matchBand,
                        requestedCategory: category,
                        selectedCategory: resolvedCategory,
                        effectivePercentile: Number(effectivePercentile.toFixed(2)),
                    };

                    if (normalizedCollegeType === 'Any' || result.type === normalizedCollegeType) {
                        predictedColleges.push(result);
                    }
                }
            }

            return predictedColleges.sort(comparePredictions).slice(0, 20);
        } catch (error) {
            throw new Error('Error predicting colleges: ' + error.message);
        }
    }
}

module.exports = PredictionService;
