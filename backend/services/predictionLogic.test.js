const {
  calculateMatchMetrics,
  inferCollegeType,
  resolvePredictionCategory,
  toEffectivePercentile,
} = require('./predictionLogic');

describe('predictionLogic', () => {
  it('maps CET Cell categories to the available cutoff buckets', () => {
    expect(resolvePredictionCategory('OPEN')).toBe('OPEN');
    expect(resolvePredictionCategory('EWS')).toBe('EWS');
    expect(resolvePredictionCategory('NT2')).toBe('NT2');
    expect(resolvePredictionCategory('SC')).toBe('SC');
  });

  it('converts JEE percentile to an MHT-CET equivalent percentile', () => {
    expect(toEffectivePercentile(96, 'JEE')).toBeCloseTo(98.3);
    expect(toEffectivePercentile(91.5, 'MHT-CET')).toBe(91.5);
  });

  it('classifies match bands by percentile gap', () => {
    expect(calculateMatchMetrics(91.5, 90)).toMatchObject({
      matchBand: 'Target',
    });
    expect(calculateMatchMetrics(91.5, 84)).toMatchObject({
      matchBand: 'Safe',
    });
  });

  it('infers college type when the database record has no explicit type', () => {
    expect(inferCollegeType({ collegeName: 'Government College of Engineering' })).toBe(
      'Government'
    );
    expect(inferCollegeType({ collegeName: 'Pune Institute of Computer Technology' })).toBe(
      'Private'
    );
  });
});
