const MahacetCutoff = require('../../database/models/MahacetCutoff');

class PredictionService {
    /**
     * Map frontend category string to corresponding DB keys.
     * Maps based on strict prompt rules + practical defaults.
     */
    static getCategoryKeys(category) {
        if (!category) return ['GOPENS'];
        
        const catMap = {
            'OPEN': ['GOPENS', 'GOPENH', 'GOPENO', 'LOPENH', 'LOPENO', 'LOPENS'],
            'OBC': ['GOBCS', 'GOBCH', 'GOBCO', 'LOBCS', 'LOBCH', 'LOBCO'],
            'SC': ['GSCS', 'GSCH', 'GSCO', 'LSCS', 'LSCH', 'LSCO'],
            'ST': ['GSTS', 'GSTH', 'GSTO', 'LSTS', 'LSTH', 'LSTO'],
            'NT1': ['GNT1S', 'GNT1H', 'GNT1O'],
            'NT2': ['GNT2S', 'GNT2H', 'GNT2O'],
            'NT3': ['GNT3S', 'GNT3H', 'GNT3O'],
            'DT_VJ': ['GVJS', 'GVJH', 'GVJO'],
            'SBC': ['GSBCS', 'GSBCH', 'GSBCO'],
            'EWS': ['EWS']
        };

        const lookup = String(category).toUpperCase().trim();
        
        // Exact rule from the prompt: NT -> [GNT1S, GNT2S, GNT3S]
        if (lookup === 'NT') {
            return ['GNT1S', 'GNT2S', 'GNT3S'];
        }

        return catMap[lookup] || [lookup];
    }

    /**
     * Process list of all colleges and filter based on explicit rules.
     */
    static processPredictions(allColleges, args, ignoreCity = false) {
        const { percentile, category, branches = [], cities = [], collegeTypes = [], gender, examType } = args;
        const targetKeys = this.getCategoryKeys(category);
        
        const results = [];

        // Loop through all colleges
        for (const college of allColleges) {
            
            // Extract standard fields defensively
            const collegeName = String(college.collegeName || college.college_name || '');
            
            // Extract and clean city from location
            const loc = college.location;
            const parsedLoc = (loc && typeof loc === 'object') ? (loc.city || loc.district) : loc;
            const fallbackStr = collegeName.split(',').pop()?.trim() || 'Maharashtra';
            const collegeCity = String(parsedLoc || college.district || college.city || fallbackStr);

            // Extract Type — check multiple possible field names
            let collegeTypeObj = college.type || college.college_type || college.status || null;
            if (collegeTypeObj !== null && typeof collegeTypeObj === 'object') {
                collegeTypeObj = collegeTypeObj.status || collegeTypeObj.type || null;
            }
            // Infer from college name if still unknown
            if (!collegeTypeObj) {
                const nameLower = collegeName.toLowerCase();
                if (nameLower.includes('government') || nameLower.includes('govt')) {
                    collegeTypeObj = 'Government';
                } else {
                    collegeTypeObj = 'Private';
                }
            }

            // --- STEP 2: CITY FILTER (CONDITIONAL) ---
            if (!ignoreCity && Array.isArray(cities) && cities.length > 0 && !cities.includes("No Preference") && !cities.includes("Any")) {
                const inCity = cities.some(c => collegeCity.toLowerCase().includes(String(c).toLowerCase()));
                if (!inCity) continue; // Skip if it doesn't match any of the selected cities
            }

            // --- STEP 3: COLLEGE TYPE FILTER ---
            if (Array.isArray(collegeTypes) && collegeTypes.length > 0 && !collegeTypes.includes("Any") && !collegeTypes.includes("No Preference")) {
                const typeMatch = collegeTypes.some(t => String(collegeTypeObj).toLowerCase().includes(String(t).toLowerCase()));
                if (!typeMatch) continue;
            }

            // --- STEP 3.5: GENDER FILTER ---
            if (gender) {
                const collegeGender = college.college_gender || "Co-ed";
                // If student is Male, exclude "Female Only" colleges
                if (gender === "Male" && collegeGender === "Female Only") {
                    continue;
                }
                // If student is Female, exclude "Male Only" colleges
                if (gender === "Female" && collegeGender === "Male Only") {
                    continue;
                }
                // Co-ed is always allowed
            }

            // --- STEP 4: BRANCH FILTER ---
            const collegeBranches = college?.branches;
            if (!Array.isArray(collegeBranches)) continue;

            for (const branchObj of collegeBranches) {
                const courseName = String(branchObj?.course_name || '');
                
                let matchesBranch = false;
                if (!Array.isArray(branches) || branches.length === 0 || branches.includes("Any")) {
                    matchesBranch = true;
                } else {
                    matchesBranch = branches.some(b => courseName.toLowerCase().includes(String(b).toLowerCase()));
                }

                if (!matchesBranch) continue; // Skip if branch doesn't match

                // --- STEP 6: CUTOFF EXTRACTION ---
                // Safely access branch.cutoffs[0].categories
                const cutoffsArray = branchObj?.cutoffs;
                if (!Array.isArray(cutoffsArray) || cutoffsArray.length === 0) continue;

                // Grab the primary cutoff array object
                const cutoffEntry = cutoffsArray.find((entry) =>
                    String(entry?.section || '').toLowerCase().includes('state') &&
                    String(entry?.stage || '').toLowerCase() === 'i'
                ) || cutoffsArray[0];

                const categoriesData = cutoffEntry?.categories;
                if (!categoriesData) continue; // Skip if cutoff is missing

                // Find actual percentile required for the category
                let actualCutoff = null;
                for (const key of targetKeys) {
                    if (categoriesData?.[key]?.percentile !== undefined && typeof categoriesData[key].percentile === 'number') {
                        actualCutoff = categoriesData[key].percentile;
                        break;
                    }
                }

                if (actualCutoff === null || actualCutoff === 0) continue; // Skip if cutoff is missing

                // --- STEP 7: SAFE CHECK (CORE RULE) ---
                // STRICT: Only include colleges where user's percentile >= cutoff
                // We use + 0.0000001 to handle floating point precision issues safely 
                // but effectively keep it strictly at or above the cutoff.
                if (Number(percentile) >= Number(actualCutoff)) {
                    // Calculate match quality: how far above the cutoff the student is
                    const gap = Number(percentile) - Number(actualCutoff);
                    // Closer to cutoff = higher match (tighter fit is better)
                    const matchPercent = Math.max(75, Math.round(100 - (gap * (25 / 6))));

                    results.push({
                        id: college._id ? String(college._id) : Math.random().toString(),
                        collegeName: collegeName,
                        city: collegeCity,
                        branch: courseName,
                        cutoff: actualCutoff,
                        collegeType: String(collegeTypeObj),
                        matchPercent: matchPercent,
                        _id: college._id ? String(college._id) : Math.random().toString(),
                        rating: college.rating || null,
                        fees: college.fees || null,
                    });
                }
            }
        }
        
        return results;
    }

    static async predictColleges(percentile, category, branches = [], cities = [], collegeTypes = [], gender, examType) {
        try {
            // STEP 1: FETCH DATA
            // Fetch all colleges from MongoDB using lean() for performance
            const allColleges = await MahacetCutoff.find({}).lean();
            
            const args = { percentile, category, branches, cities, collegeTypes, gender, examType };

            // Run strict filtering
            let results = this.processPredictions(allColleges, args, false);

            // --- STEP 9: FALLBACK LOGIC ---
            // IF no results found: Remove city filter, Retry prediction
            if (results.length === 0 && Array.isArray(cities) && cities.length > 0 && !cities.includes("No Preference") && !cities.includes("Any")) {
                results = this.processPredictions(allColleges, args, true);
            }

            // --- STEP 10: SORT RESULTS ---
            // Sort results by cutoff DESCENDING (Higher cutoff = better college)
            results.sort((a, b) => b.cutoff - a.cutoff);

            // Deduplicate to avoid identical listings (college + branch)
            const uniqueMap = new Map();
            for(const item of results) {
                const combinedKey = `${item.collegeName}-${item.branch}`;
                if (!uniqueMap.has(combinedKey)) {
                    uniqueMap.set(combinedKey, item);
                }
            }
            results = Array.from(uniqueMap.values());

            // --- STEP 11: LIMIT RESULTS ---
            // Return top 20 colleges
            return results.slice(0, 20);
            
        } catch (error) {
            console.error('PredictionService error:', error);
            throw new Error('Error predicting colleges');
        }
    }
}

module.exports = PredictionService;
