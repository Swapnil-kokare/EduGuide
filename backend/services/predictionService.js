const MahacetCutoff = require('../../database/models/MahacetCutoff');

class PredictionService {
    /**
     * Map frontend category string to corresponding DB keys.
     * Maps based on strict prompt rules + practical defaults.
     */
    static getCategoryKeys(category, isPwd = false, isDefense = false, isTfws = false, isOrphan = false) {
        if (!category) return ['GOPENS'];

        const lookup = String(category).toUpperCase().trim();
        const keys = [];

        // If user explicitly chose TFWS or ORPHAN as their category
        if (lookup === 'TFWS') return ['TFWS'];
        if (lookup === 'ORPHAN') return ['ORPHAN'];

        // If PWD is true, map to PWD versions
        if (isPwd) {
            const pwdMap = {
                'OPEN': ['PWDOPENS', 'PWDOPENH'],
                'OBC': ['PWDOBCS', 'PWDOBCH', 'PWDROBC'],
                'SC': ['PWDRSCS'],
                'ST': ['PWDSTS'],
                'NT1': ['PWDRNT1S'],
                'NT2': ['PWDRNT2S'],
                'NT3': ['PWDRNT3S'],
                'DT_VJ': ['PWDRVJS'],
                'SBC': ['PWDRSBCS'],
                'EWS': ['PWDEWS']
            };
            keys.push(...(pwdMap[lookup] || [`PWD${lookup}S`]));
        }

        // If Defense is true, map to DEF versions
        if (isDefense) {
            const defMap = {
                'OPEN': ['DEFOPENS'],
                'OBC': ['DEFOBCS', 'DEFROBCS'],
                'SC': ['DEFSCS', 'DEFRSCS'],
                'ST': ['DEFSTS', 'DEFRSTS'],
                'NT1': ['DEFRNT1S'],
                'NT2': ['DEFRNT2S'],
                'NT3': ['DEFRNT3S'],
                'DT_VJ': ['DEFRVJS'],
                'SBC': ['DEFRSBCS'],
                'EWS': ['DEFEWS'],
                'SEBC': ['DEFRSEBC']
            };
            keys.push(...(defMap[lookup] || [`DEF${lookup}S`]));
        }

        // Add TFWS if applicable (form checkbox OR category dropdown)
        if (isTfws || lookup === 'TFWS') keys.push('TFWS');

        // Add ORPHAN if applicable (form checkbox OR category dropdown)
        if (isOrphan || lookup === 'ORPHAN') keys.push('ORPHAN');

        // Add standard category keys to the list so users can see all seats they are eligible for
        const catMap = {
            'OPEN': ['GOPENS'],
            'OBC': ['GOBCS'],
            'SC': ['GSCS'],
            'ST': ['GSTS'],
            'NT1': ['GNT1S'],
            'NT2': ['GNT2S'],
            'NT3': ['GNT3S'],
            'DT_VJ': ['GVJS'],
            'SBC': ['GSBCS'],
            'EWS': ['EWS']
        };

        if (lookup === 'NT') {
            keys.push('GNT1S', 'GNT2S', 'GNT3S');
        } else {
            keys.push(...(catMap[lookup] || [lookup]));
        }

        return [...new Set(keys)];
    }

    /**
     * Process list of all colleges and filter based on explicit rules.
     */
    static processPredictions(allColleges, args, ignoreDistrict = false) {
        const { percentile, category, branches = [], districts = [], collegeTypes = [], gender, examType, isPwd, isDefense, isTfws, isOrphan } = args;
        const targetKeys = this.getCategoryKeys(category, isPwd, isDefense, isTfws, isOrphan);
        
        const results = [];

        // Loop through all colleges
        for (const college of allColleges) {
            
            // Extract standard fields defensively
            const collegeName = String(college.collegeName || college.college_name || '');
            
            // Extract and clean district from location
            const loc = college.location;
            const parsedLoc = (loc && typeof loc === 'object') ? (loc.city || loc.district) : loc;
            const fallbackStr = collegeName.split(',').pop()?.trim() || 'Maharashtra';
            const collegeDistrict = String(parsedLoc || college.district || college.city || fallbackStr);

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

            // --- STEP 2: DISTRICT FILTER (CONDITIONAL) ---
            if (!ignoreDistrict && Array.isArray(districts) && districts.length > 0) {
                const inDistrict = districts.some(d => collegeDistrict.toLowerCase().includes(String(d).toLowerCase()));
                if (!inDistrict) continue; // Skip if it doesn't match any selected districts
            }

            // --- STEP 3: COLLEGE TYPE FILTER ---
            if (Array.isArray(collegeTypes) && collegeTypes.length > 0 && !collegeTypes.includes("Any") && !collegeTypes.includes("No Preference")) {
                const typeMatch = collegeTypes.some(t => String(collegeTypeObj).toLowerCase().includes(String(t).toLowerCase()));
                if (!typeMatch) continue;
            }

            // --- STEP 3.5: GENDER FILTER ---
            if (gender) {
                let collegeGender = college.college_gender || "Co-ed";
                
                // FALLBACK: If explicit field is missing, check the college name
                if (!college.college_gender) {
                    const nameLower = collegeName.toLowerCase();
                    if (nameLower.includes("women") || nameLower.includes("girls") || nameLower.includes("ladies")) {
                        collegeGender = "Female Only";
                    } else if (nameLower.includes("boys") || nameLower.includes("mens")) {
                        collegeGender = "Male Only";
                    }
                }

                // Apply exclusion rules
                if (gender === "Male" && collegeGender === "Female Only") {
                    continue;
                }
                if (gender === "Female" && collegeGender === "Male Only") {
                    continue;
                }
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
                    matchesBranch = branches.some(b => {
                        const searchTerm = String(b).toLowerCase();
                        const target = courseName.toLowerCase();
                        
                        // Standard contains check
                        if (target.includes(searchTerm)) return true;
                        
                        // Smart Aliases
                        if (searchTerm.includes("artificial intelligence") && (target.includes(" ai ") || target.endsWith(" ai") || target.includes("(ai)"))) return true;
                        if (searchTerm === "ai" && target.includes("artificial intelligence")) return true;
                        if (searchTerm.includes("machine learning") && target.includes(" ml")) return true;
                        if (searchTerm === "ml" && target.includes("machine learning")) return true;
                        if (searchTerm === "computer science" && target.includes("computer engineering")) return true;
                        if (searchTerm === "computer engineering" && target.includes("computer science")) return true;
                        
                        return false;
                    });
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
                        city: collegeDistrict,
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

    static async predictColleges(percentile, category, branches = [], districts = [], collegeTypes = [], gender, isPwd, isDefense, isTfws, isOrphan, examType) {
        try {
            // STEP 1: FETCH DATA
            // Fetch all colleges from MongoDB using lean() for performance
            const allColleges = await MahacetCutoff.find({}).lean();
            
            const args = { percentile, category, branches, districts, collegeTypes, gender, isPwd, isDefense, isTfws, isOrphan, examType };

            // Run strict filtering
            let results = this.processPredictions(allColleges, args, false);

            // --- STEP 9: FALLBACK LOGIC ---
            // IF no results found: Remove district filter, Retry prediction
            if (results.length === 0 && Array.isArray(districts) && districts.length > 0) {
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
            // Return top 50 colleges
            return results.slice(0, 50);
            
        } catch (error) {
            console.error('PredictionService error:', error);
            throw new Error('Error predicting colleges');
        }
    }
}

module.exports = PredictionService;
