const { PDFParse } = require('../shared/pdfParse');

const ALLOTMENT_LIST_URL =
  'https://fe2025.mahacet.org/StaticPages/frmInstituteWiseAllotmentList.aspx?did=2021';
const SOURCE_ROUND = 'CAP-IV';

const CATEGORY_SEAT_TYPE_MAP = {
  OPEN: [/^GOPEN[SHO]$/],
  EWS: [/^GEWS[SHO]$/, /^EWSS$/, /^EWS$/],
  OBC: [/^GOBC[SHO]$/],
  DT_VJ: [/^GVJ[SHO]$/],
  NT1: [/^GNT1[SHO]$/],
  NT2: [/^GNT2[SHO]$/],
  NT3: [/^GNT3[SHO]$/],
  SBC: [/^GSBC[SHO]$/],
  SEBC: [/^GSEBC[SHO]$/],
  SC: [/^GSC[SHO]$/],
  ST: [/^GST[SHO]$/],
};

function decodeHtmlEntities(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&#39;', "'")
    .replaceAll('&nbsp;', ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseAllotmentListHtml(html) {
  const tableMatch = html.match(
    /<table[^>]*id="rightContainer_ContentTable1_gvInstituteList"[^>]*>([\s\S]*?)<\/table>/i
  );

  if (!tableMatch) {
    throw new Error('Could not find institute-wise allotment table');
  }

  return [...tableMatch[1].matchAll(/<tr>([\s\S]*?)<\/tr>/gi)]
    .slice(1)
    .map((rowMatch) => [...rowMatch[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((cell) => cell[1]))
    .filter((cells) => cells.length >= 7)
    .map((cells) => {
      const instituteCode = decodeHtmlEntities(cells[1].replace(/<[^>]+>/g, ''));
      const instituteName = decodeHtmlEntities(cells[2].replace(/<[^>]+>/g, ''));
      const capIvMatch = cells[6].match(/href\s*=\s*"([^"]+CAP-IV[^"]+\.pdf)"/i);

      return {
        instituteCode,
        instituteName,
        pdfUrl: capIvMatch ? capIvMatch[1] : null,
      };
    })
    .filter((row) => row.instituteCode && row.pdfUrl);
}

function extractChoiceCode(pageText) {
  const match =
    pageText.match(/\b(\d{10}[A-Z]?)\s*-\s*([^\n]+)/) ||
    pageText.match(/\b(\d{10}[A-Z]?)\s+([A-Za-z][^\n]+)\n/);

  if (!match) {
    return null;
  }

  return {
    choiceCode: match[1],
    courseName: match[2].replace(/\s+/g, ' ').trim(),
  };
}

function extractSeatRows(pageText) {
  return [...pageText.matchAll(/(EN\d{8})[\s\S]*?[\^\*@~&]\s+([A-Z0-9]+)\t(\d+\.\d+)/g)].map(
    (match) => ({
      seatType: match[2],
      score: Number.parseFloat(match[3]),
    })
  );
}

function resolveSeatTypeScore(seatCutoffs, seatPatterns) {
  const matchingScores = Object.entries(seatCutoffs)
    .filter(([seatType]) => seatPatterns.some((pattern) => pattern.test(seatType)))
    .map(([, score]) => score)
    .filter((score) => typeof score === 'number');

  if (matchingScores.length === 0) {
    return null;
  }

  return Math.min(...matchingScores);
}

function buildCategoryCutoffs(seatCutoffs) {
  const categoryCutoff = {};

  for (const [category, seatTypes] of Object.entries(CATEGORY_SEAT_TYPE_MAP)) {
    const score = resolveSeatTypeScore(seatCutoffs, seatTypes);
    if (typeof score === 'number') {
      categoryCutoff[category] = Number(score.toFixed(7));
    }
  }

  return categoryCutoff;
}

async function parseInstituteCutoffPdf(pdfUrl) {
  const parser = new PDFParse({ url: pdfUrl });
  const result = await parser.getText();
  await parser.destroy();

  const records = new Map();

  for (const page of result.pages) {
    const header = extractChoiceCode(page.text);
    if (!header) {
      continue;
    }

    const existing = records.get(header.choiceCode) || {
      choiceCode: header.choiceCode,
      courseName: header.courseName,
      seatCutoffs: {},
    };

    for (const row of extractSeatRows(page.text)) {
      const currentValue = existing.seatCutoffs[row.seatType];
      if (typeof currentValue !== 'number' || row.score < currentValue) {
        existing.seatCutoffs[row.seatType] = row.score;
      }
    }

    records.set(header.choiceCode, existing);
  }

  return [...records.values()];
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

async function fetchOfficialCutoffRecords(options = {}) {
  const { limit, concurrency = 3, onProgress, catalogRows = [] } = options;
  const listHtml = await fetch(ALLOTMENT_LIST_URL).then((response) => response.text());
  const institutes = parseAllotmentListHtml(listHtml);
  const selectedInstitutes =
    typeof limit === 'number' && limit > 0 ? institutes.slice(0, limit) : institutes;

  const catalogByChoiceCode = new Map(catalogRows.map((row) => [row.choiceCode, row]));

  const instituteResults = await mapWithConcurrency(
    selectedInstitutes,
    concurrency,
    async (institute, index) => {
      const parsedChoices = await parseInstituteCutoffPdf(institute.pdfUrl);

      const enriched = parsedChoices
        .map((choice) => {
          const catalog = catalogByChoiceCode.get(choice.choiceCode);
          if (!catalog) {
            return null;
          }

          const categoryCutoff = buildCategoryCutoffs(choice.seatCutoffs);
          if (Object.keys(categoryCutoff).length === 0) {
            return null;
          }

          const type = /government|university/i.test(catalog.courseStatus || catalog.instituteStatus || '')
            ? 'Government'
            : 'Private';

          return {
            instituteCode: catalog.instituteCode,
            choiceCode: choice.choiceCode,
            collegeName: catalog.instituteName,
            city: catalog.district,
            branch: catalog.courseName,
            categoryCutoff,
            fees: 0,
            type,
            sourceRound: SOURCE_ROUND,
            sourceUrl: institute.pdfUrl,
          };
        })
        .filter(Boolean);

      if (typeof onProgress === 'function') {
        onProgress({
          completed: index + 1,
          total: selectedInstitutes.length,
          instituteCode: institute.instituteCode,
          records: enriched.length,
        });
      }

      return enriched;
    }
  );

  return instituteResults.flat();
}

module.exports = {
  ALLOTMENT_LIST_URL,
  CATEGORY_SEAT_TYPE_MAP,
  SOURCE_ROUND,
  buildCategoryCutoffs,
  fetchOfficialCutoffRecords,
  parseAllotmentListHtml,
};
