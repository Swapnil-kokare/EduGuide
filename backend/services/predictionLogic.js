const SUPPORTED_EXAM_TYPES = ['MHT-CET', 'JEE'];
const SUPPORTED_COLLEGE_TYPES = ['Any', 'Government', 'Private'];
const CATEGORY_BUCKET_MAP = {
  OPEN: 'OPEN',
  EWS: 'EWS',
  OBC: 'OBC',
  DT_VJ: 'DT_VJ',
  NT1: 'NT1',
  NT2: 'NT2',
  NT3: 'NT3',
  SBC: 'SBC',
  SEBC: 'SEBC',
  SC: 'SC',
  ST: 'ST',
};
const CATEGORY_CUTOFF_KEY_MAP = {
  OPEN: 'GOPENS',
  EWS: 'EWS',
  OBC: 'GOBCS',
  DT_VJ: 'GVJS',
  NT1: 'GNT1S',
  NT2: 'GNT2S',
  NT3: 'GNT3S',
  SBC: 'GSEBCS',
  SEBC: 'GSEBCS',
  SC: 'GSCS',
  ST: 'GSTS',
};
const SUPPORTED_CATEGORIES = Object.keys(CATEGORY_BUCKET_MAP);

const GOVERNMENT_NAME_PATTERNS = [
  /\bgovernment college\b/i,
  /\bcoep\b/i,
  /\bvjti\b/i,
  /\bvnit\b/i,
  /\bsggs\b/i,
  /\bwalchand college of engineering\b/i,
  /\biit\b/i,
  /\bnit\b/i,
];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildExactCaseInsensitiveRegex(value) {
  return new RegExp(`^${escapeRegex(value.trim())}$`, 'i');
}

function normalizeCategory(category) {
  return String(category || '')
    .trim()
    .replace(/\s+/g, ' ')
    .toUpperCase();
}

function resolvePredictionCategory(category) {
  const normalizedCategory = normalizeCategory(category);
  return CATEGORY_BUCKET_MAP[normalizedCategory] || null;
}

function getCutoffCategoryKey(resolvedCategory) {
  return CATEGORY_CUTOFF_KEY_MAP[resolvedCategory] || null;
}

function normalizeExamType(examType) {
  return SUPPORTED_EXAM_TYPES.includes(examType) ? examType : 'MHT-CET';
}

function normalizeCollegeType(collegeType) {
  return SUPPORTED_COLLEGE_TYPES.includes(collegeType) ? collegeType : 'Any';
}

function convertJeeToMhtCetPercentile(percentile) {
  if (percentile >= 99) return 99.5;
  if (percentile >= 95) return 98 + (percentile - 95) * 0.3;
  if (percentile >= 85) return 94 + (percentile - 85) * 0.4;
  if (percentile >= 70) return 85 + (percentile - 70) * 0.6;
  return Math.min(percentile * 1.15, 84.9);
}

function toEffectivePercentile(score, examType) {
  const numericScore = Number(score);
  if (Number.isNaN(numericScore)) {
    return null;
  }

  return normalizeExamType(examType) === 'JEE'
    ? convertJeeToMhtCetPercentile(numericScore)
    : numericScore;
}

function inferCollegeType(college) {
  if (college.type === 'Government' || college.type === 'Private') {
    return college.type;
  }

  const name = `${college.collegeName || ''} ${college.branch || ''}`.trim();
  return GOVERNMENT_NAME_PATTERNS.some((pattern) => pattern.test(name))
    ? 'Government'
    : 'Private';
}

function calculateMatchMetrics(effectivePercentile, cutoff) {
  let numericCutoff = Number(cutoff);
  if (Number.isNaN(numericCutoff)) {
    numericCutoff = 0;
  }

  const scoreGap = Number((effectivePercentile - numericCutoff).toFixed(2));
  
  let matchBand;
  let rankBucket;
  let matchPercent;

  // Since we only show colleges where percentile >= cutoff, scoreGap is always >= 0
  if (scoreGap <= 3) {
    matchBand = 'Target';
    rankBucket = 0;
    // Ideal target — closest match to cutoff
    matchPercent = Math.round(99 - scoreGap * 4.6);
  } else {
    matchBand = 'Safe';
    rankBucket = 1;
    // Comfortably above cutoff
    matchPercent = Math.max(50, Math.round(85 - (scoreGap - 3) * 3));
  }

  return {
    cutoffUsed: numericCutoff,
    scoreGap,
    matchPercent,
    matchBand,
    rankBucket,
  };
}

function comparePredictions(a, b) {
  if (a.rankBucket !== b.rankBucket) {
    return a.rankBucket - b.rankBucket;
  }

  if (b.cutoffUsed !== a.cutoffUsed) {
    return b.cutoffUsed - a.cutoffUsed;
  }

  if (b.matchPercent !== a.matchPercent) {
    return b.matchPercent - a.matchPercent;
  }

  return a.scoreGap - b.scoreGap;
}

module.exports = {
  CATEGORY_BUCKET_MAP,
  SUPPORTED_CATEGORIES,
  SUPPORTED_COLLEGE_TYPES,
  SUPPORTED_EXAM_TYPES,
  buildExactCaseInsensitiveRegex,
  calculateMatchMetrics,
  comparePredictions,
  inferCollegeType,
  normalizeCategory,
  normalizeCollegeType,
  normalizeExamType,
  resolvePredictionCategory,
  getCutoffCategoryKey,
  toEffectivePercentile,
};
