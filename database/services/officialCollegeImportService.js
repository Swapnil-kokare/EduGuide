const CET_CELL_SOURCE = {
  siteName: 'State CET Cell, Government of Maharashtra',
  programName:
    'First Year Under Graduate Technical Courses in Engineering and Technology (4 Years)',
  academicYear: '2025-26',
  instituteListUrl: 'https://fe2025.mahacet.org/StaticPages/frmInstituteList.aspx',
  instituteSummaryBaseUrl:
    'https://fe2025.mahacet.org/StaticPages/frmInstituteSummary.aspx?InstituteCode=',
};

const HTML_ENTITY_MAP = {
  '&amp;': '&',
  '&nbsp;': ' ',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&lt;': '<',
  '&gt;': '>',
};

function decodeHtmlEntities(value) {
  return Object.entries(HTML_ENTITY_MAP).reduce(
    (decoded, [entity, replacement]) => decoded.replaceAll(entity, replacement),
    value
  )
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

function cleanText(value) {
  return decodeHtmlEntities(value.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function parseInteger(value) {
  const numericValue = Number.parseInt(String(value).replace(/[^\d]/g, ''), 10);
  return Number.isNaN(numericValue) ? 0 : numericValue;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getTableMarkup(html, tableId) {
  const tableRegex = new RegExp(
    `<table[^>]*id="${escapeRegExp(tableId)}"[^>]*>([\\s\\S]*?)<\\/table>`,
    'i'
  );
  const match = html.match(tableRegex);
  return match ? match[1] : '';
}

function extractRows(tableMarkup) {
  return [...tableMarkup.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map((match) => match[1]);
}

function extractCells(rowMarkup) {
  return [...rowMarkup.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((match) =>
    cleanText(match[1])
  );
}

function extractSpanValue(html, spanId) {
  const spanRegex = new RegExp(
    `<span[^>]*id="${escapeRegExp(spanId)}"[^>]*>[\\s\\S]*?<b>([\\s\\S]*?)<\\/b>[\\s\\S]*?<\\/span>`,
    'i'
  );
  const match = html.match(spanRegex);
  return match ? cleanText(match[1]) : '';
}

function parseInstituteListHtml(html) {
  const tableMarkup = getTableMarkup(html, 'rightContainer_ContentTable1_gvInstituteList');
  const rows = extractRows(tableMarkup).slice(1);

  return rows
    .map((rowMarkup) => extractCells(rowMarkup))
    .filter((cells) => cells.length >= 5 && cells[1] && cells[2])
    .map((cells) => {
      const [, instituteCode, instituteName, listStatus, totalIntake] = cells;
      return {
        instituteCode,
        instituteName,
        listStatus,
        instituteTotalIntake: parseInteger(totalIntake),
        sourceUrl: `${CET_CELL_SOURCE.instituteSummaryBaseUrl}${instituteCode}`,
      };
    });
}

function parseInstituteSummaryHtml(html, instituteOverview, importedAt = new Date()) {
  const details = {
    instituteCode:
      instituteOverview.instituteCode ||
      extractSpanValue(html, 'rightContainer_ContentBox1_lblInstituteCode'),
    instituteName:
      instituteOverview.instituteName ||
      extractSpanValue(html, 'rightContainer_ContentBox1_lblInstituteName'),
    instituteAddress: extractSpanValue(html, 'rightContainer_ContentBox1_lblInstituteAddress'),
    region: extractSpanValue(html, 'rightContainer_ContentBox1_lblRegion'),
    district: extractSpanValue(html, 'rightContainer_ContentBox1_lblDistrict'),
    instituteStatus: extractSpanValue(html, 'rightContainer_ContentBox1_lblStatus1'),
    autonomyStatus: extractSpanValue(html, 'rightContainer_ContentBox1_lblStatus2'),
    minorityStatus: extractSpanValue(html, 'rightContainer_ContentBox1_lblStatus3'),
    publicRemark: extractSpanValue(html, 'rightContainer_ContentBox1_lblPublicRemark'),
    instituteTotalIntake: instituteOverview.instituteTotalIntake || 0,
  };

  const courseTableMarkup = getTableMarkup(html, 'rightContainer_ContentBox7_gvChoiceCodeList');
  const rows = extractRows(courseTableMarkup).slice(1);

  return rows
    .map((rowMarkup) => extractCells(rowMarkup))
    .filter((cells) => cells.length >= 10)
    .map((cells) => {
      const [
        choiceCode,
        courseName,
        university,
        courseStatus,
        courseAutonomyStatus,
        courseMinorityStatus,
        shift,
        accreditation,
        gender,
        totalIntake,
      ] = cells;

      return {
        ...details,
        choiceCode,
        courseName,
        university,
        courseStatus,
        courseAutonomyStatus,
        courseMinorityStatus,
        shift,
        accreditation,
        gender,
        courseIntake: parseInteger(totalIntake),
        sourceSite: CET_CELL_SOURCE.siteName,
        sourceProgram: CET_CELL_SOURCE.programName,
        academicYear: CET_CELL_SOURCE.academicYear,
        sourceUrl: instituteOverview.sourceUrl,
        importedAt,
      };
    });
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'career-guide-pro official CET importer',
    },
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

async function mapWithConcurrency(items, concurrency, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  });

  await Promise.all(workers);
  return results;
}

async function fetchOfficialColleges(options = {}) {
  const { limit, concurrency = 6, onProgress } = options;
  const listHtml = await fetchHtml(CET_CELL_SOURCE.instituteListUrl);
  const institutes = parseInstituteListHtml(listHtml);
  const selectedInstitutes =
    typeof limit === 'number' && limit > 0 ? institutes.slice(0, limit) : institutes;
  const importedAt = new Date();

  const recordsByInstitute = await mapWithConcurrency(
    selectedInstitutes,
    concurrency,
    async (institute, index) => {
      const summaryHtml = await fetchHtml(institute.sourceUrl);
      const records = parseInstituteSummaryHtml(summaryHtml, institute, importedAt);

      if (typeof onProgress === 'function') {
        onProgress({
          completed: index + 1,
          total: selectedInstitutes.length,
          instituteCode: institute.instituteCode,
          instituteName: institute.instituteName,
          records: records.length,
        });
      }

      return records;
    }
  );

  return recordsByInstitute.flat();
}

module.exports = {
  CET_CELL_SOURCE,
  fetchOfficialColleges,
  parseInstituteListHtml,
  parseInstituteSummaryHtml,
};
