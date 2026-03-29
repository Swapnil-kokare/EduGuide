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
  const scoreGap = Number((effectivePercentile - cutoff).toFixed(2));
  const matchPercent = Math.max(35, Math.min(98, Math.round(98 - scoreGap * 3)));

  const matchBand = scoreGap <= 3 ? 'Target' : 'Safe';
  const rankBucket = scoreGap <= 3 ? 0 : 1;

  return {
    cutoffUsed: cutoff,
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
  toEffectivePercentile,
};
