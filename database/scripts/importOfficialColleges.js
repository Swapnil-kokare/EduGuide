const fs = require('fs/promises');
const path = require('path');
const mongoose = require('../shared/mongoose');
const dotenv = require('../shared/dotenv');
const OfficialCollege = require('../models/OfficialCollege');
const {
  CET_CELL_SOURCE,
  fetchOfficialColleges,
} = require('../services/officialCollegeImportService');

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
      sourceSite: CET_CELL_SOURCE.siteName,
      sourceProgram: CET_CELL_SOURCE.programName,
      academicYear: CET_CELL_SOURCE.academicYear,
      sourceUrl: CET_CELL_SOURCE.instituteListUrl,
      generatedAt: new Date().toISOString(),
      records: records.length,
    },
    records,
  };

  await fs.mkdir(path.dirname(snapshotPath), { recursive: true });
  await fs.writeFile(snapshotPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

async function syncMongo(records) {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/career-guide';
  await mongoose.connect(mongoUri);
  await OfficialCollege.deleteMany({});
  await OfficialCollege.insertMany(records, { ordered: false });
  await mongoose.disconnect();
}

async function main() {
  const limit = Number.parseInt(getArgValue('--limit', ''), 10);
  const shouldSkipDb = hasFlag('--skip-db');
  const snapshotPath = path.resolve(
    getArgValue(
      '--write-json',
      path.join(__dirname, '..', 'data', 'official-colleges-2025-26.json')
    )
  );

  console.log(`Fetching official CET Cell colleges from ${CET_CELL_SOURCE.instituteListUrl}`);

  const records = await fetchOfficialColleges({
    limit: Number.isNaN(limit) ? undefined : limit,
    onProgress: ({ completed, total, instituteCode, records: courseCount }) => {
      if (completed === total || completed % 25 === 0) {
        console.log(
          `Processed ${completed}/${total} institutes | ${instituteCode} | ${courseCount} courses`
        );
      }
    },
  });

  await writeSnapshot(snapshotPath, records);
  console.log(`Saved ${records.length} records to ${snapshotPath}`);

  if (shouldSkipDb) {
    console.log('Skipping MongoDB import because --skip-db was provided.');
    return;
  }

  await syncMongo(records);
  console.log(`Imported ${records.length} official college records into MongoDB.`);
}

main().catch(async (error) => {
  console.error('Official CET import failed:', error.message);
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  process.exit(1);
});
