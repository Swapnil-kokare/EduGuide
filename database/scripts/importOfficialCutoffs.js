const fs = require('fs/promises');
const path = require('path');
const mongoose = require('../shared/mongoose');
const dotenv = require('../shared/dotenv');
const College = require('../models/College');
const {
  ALLOTMENT_LIST_URL,
  SOURCE_ROUND,
  fetchOfficialCutoffRecords,
} = require('../services/officialCutoffImportService');

dotenv.config({ path: path.join(__dirname, '..', '..', 'backend', '.env') });

function hasFlag(flag) {
  return process.argv.includes(flag);
}

function getArgValue(flag, fallbackValue) {
  const index = process.argv.indexOf(flag);
  if (index === -1 || index === process.argv.length - 1) {
    return fallbackValue;
  }

  return process.argv[index + 1];
}

async function writeSnapshot(snapshotPath, records) {
  const payload = {
    metadata: {
      sourceUrl: ALLOTMENT_LIST_URL,
      sourceRound: SOURCE_ROUND,
      academicYear: '2025-26',
      generatedAt: new Date().toISOString(),
      records: records.length,
    },
    records,
  };

  await fs.mkdir(path.dirname(snapshotPath), { recursive: true });
  await fs.writeFile(snapshotPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

async function loadOfficialCollegeCatalog() {
  const snapshotPath = path.join(__dirname, '..', 'data', 'official-colleges-2025-26.json');
  const snapshotText = await fs.readFile(snapshotPath, 'utf8');
  const snapshot = JSON.parse(snapshotText);
  return snapshot.records || [];
}

async function syncMongo(records) {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/career-guide';
  await mongoose.connect(mongoUri);
  await College.deleteMany({});
  await College.insertMany(records, { ordered: false });
  await mongoose.disconnect();
}

async function main() {
  const limit = Number.parseInt(getArgValue('--limit', ''), 10);
  const shouldSkipDb = hasFlag('--skip-db');
  const snapshotPath = path.resolve(
    getArgValue(
      '--write-json',
      path.join(__dirname, '..', 'data', 'official-cutoffs-2025-26.json')
    )
  );

  const catalogRows = await loadOfficialCollegeCatalog();
  const records = await fetchOfficialCutoffRecords({
    limit: Number.isNaN(limit) ? undefined : limit,
    catalogRows,
    onProgress: ({ completed, total, instituteCode, records: count }) => {
      if (completed === total || completed % 20 === 0) {
        console.log(`Processed ${completed}/${total} institutes | ${instituteCode} | ${count} branches`);
      }
    },
  });

  await writeSnapshot(snapshotPath, records);
  console.log(`Saved ${records.length} cutoff records to ${snapshotPath}`);

  if (shouldSkipDb) {
    console.log('Skipping MongoDB import because --skip-db was provided.');
    return;
  }

  await syncMongo(records);
  console.log(`Imported ${records.length} official cutoff records into MongoDB.`);
}

main().catch(async (error) => {
  console.error('Official cutoff import failed:', error.message);
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  process.exit(1);
});
