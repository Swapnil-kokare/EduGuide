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

            // Search the ENTIRE cutoff database (1500+ records)
            // MongoDB filters by branch name for performance
            const rawResults = await MahacetCutoff.find({
                'branches.course_name': branchRegex,
            }).lean();

            console.log(`DB returned ${rawResults.length} colleges for branch "${branch}"`);

            const predictedColleges = [];

            for (const college of rawResults) {
                if (!Array.isArray(college.branches)) {
                    continue;
                }

                for (const branchItem of college.branches) {
                    if (!branchRegex.test(branchItem.course_name || '')) {
                        continue;
                    }

                    // Try to find the best cutoff entry (State Level, Stage I preferred)
                    const cutoffData = Array.isArray(branchItem.cutoffs)
                        ? branchItem.cutoffs.find((entry) =>
                            String(entry.section || '').toLowerCase().includes('state') &&
                            String(entry.stage || '').toLowerCase() === 'i'
                        ) || branchItem.cutoffs[0]
                        : null;

                    const categoryInfo = cutoffData?.categories?.[cutoffCategoryKey];
                    const cutoff = categoryInfo?.percentile ?? 0;

                    // Skip colleges with no cutoff data for this category
                    if (cutoff === 0) {
                        continue;
                    }

                    // Only include colleges where student percentile >= cutoff
                    // (only achievable colleges — no "Reach")
                    if (effectivePercentile < cutoff) {
                        continue;
                    }

                    const metrics = calculateMatchMetrics(effectivePercentile, cutoff);

                    const collegeName = college.college_name || college.collegeName || '';
                    const inferredType = inferCollegeType({ collegeName, branch: branchItem.course_name });
                    // Always derive location from database college name
                    const collegeCity = (collegeName.split(',').pop() || '').trim() || 'Maharashtra';

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

            console.log(`Found ${predictedColleges.length} achievable colleges, returning best 20`);

            // Sort by best match and return the top 20 best options
            return predictedColleges.sort(comparePredictions).slice(0, 20);
        } catch (error) {
            console.error('PredictionService error:', error.message);
            throw new Error('Error predicting colleges: ' + error.message);
        }
    }
}

module.exports = PredictionService;
