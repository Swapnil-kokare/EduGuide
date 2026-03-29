const {
  CET_CELL_SOURCE,
  parseInstituteListHtml,
  parseInstituteSummaryHtml,
} = require('./officialCollegeImportService');

describe('officialCollegeImportService', () => {
  it('parses the institute list rows from the official CET Cell markup', () => {
    const html = `
      <table id="rightContainer_ContentTable1_gvInstituteList">
        <tr>
          <th>Sr. No.</th><th>Institute Code</th><th>Institute Name</th><th>Status</th><th>Total Intake</th>
        </tr>
        <tr>
          <td>1.</td>
          <td><a href="frmInstituteSummary.aspx?InstituteCode=01002">01002</a></td>
          <td>Government College of Engineering, Amravati</td>
          <td>Government, Autonomous</td>
          <td>390</td>
        </tr>
      </table>
    `;

    expect(parseInstituteListHtml(html)).toEqual([
      {
        instituteCode: '01002',
        instituteName: 'Government College of Engineering, Amravati',
        listStatus: 'Government, Autonomous',
        instituteTotalIntake: 390,
        sourceUrl: `${CET_CELL_SOURCE.instituteSummaryBaseUrl}01002`,
      },
    ]);
  });

  it('parses institute summary rows into course records', () => {
    const html = `
      <span id="rightContainer_ContentBox1_lblInstituteCode"><b>01002</b></span>
      <span id="rightContainer_ContentBox1_lblInstituteName"><b>Government College of Engineering, Amravati</b></span>
      <span id="rightContainer_ContentBox1_lblInstituteAddress"><b>VMV Road, Near Kathora Naka, Amravati</b></span>
      <span id="rightContainer_ContentBox1_lblRegion"><b>Amravati</b></span>
      <span id="rightContainer_ContentBox1_lblDistrict"><b>Amravati</b></span>
      <span id="rightContainer_ContentBox1_lblStatus1"><b>Government</b></span>
      <span id="rightContainer_ContentBox1_lblStatus2"><b>Autonomous</b></span>
      <span id="rightContainer_ContentBox1_lblStatus3"><b>Non-Minority</b></span>
      <span id="rightContainer_ContentBox1_lblPublicRemark"><b></b></span>
      <table id="rightContainer_ContentBox7_gvChoiceCodeList">
        <tr>
          <th>Choice Code</th><th>Course Name</th><th>University</th><th>Status</th><th>Autonomy Status</th><th>Minority Status</th><th>Shift</th><th>Accreditation</th><th>Gender</th><th>Total Intake</th>
        </tr>
        <tr>
          <td>010024210</td>
          <td>Computer Engineering</td>
          <td>Sant Gadge Baba Amravati University</td>
          <td>Government</td>
          <td>Autonomous</td>
          <td>Non-Minority</td>
          <td>General Shift</td>
          <td>-</td>
          <td>Co-Education</td>
          <td>120</td>
        </tr>
      </table>
    `;

    const [record] = parseInstituteSummaryHtml(
      html,
      {
        instituteCode: '01002',
        instituteName: 'Government College of Engineering, Amravati',
        instituteTotalIntake: 390,
        sourceUrl: `${CET_CELL_SOURCE.instituteSummaryBaseUrl}01002`,
      },
      new Date('2026-03-29T00:00:00.000Z')
    );

    expect(record).toMatchObject({
      instituteCode: '01002',
      instituteName: 'Government College of Engineering, Amravati',
      instituteAddress: 'VMV Road, Near Kathora Naka, Amravati',
      region: 'Amravati',
      district: 'Amravati',
      instituteStatus: 'Government',
      autonomyStatus: 'Autonomous',
      minorityStatus: 'Non-Minority',
      instituteTotalIntake: 390,
      choiceCode: '010024210',
      courseName: 'Computer Engineering',
      university: 'Sant Gadge Baba Amravati University',
      courseStatus: 'Government',
      courseAutonomyStatus: 'Autonomous',
      courseMinorityStatus: 'Non-Minority',
      shift: 'General Shift',
      accreditation: '-',
      gender: 'Co-Education',
      courseIntake: 120,
      sourceSite: CET_CELL_SOURCE.siteName,
      sourceProgram: CET_CELL_SOURCE.programName,
      academicYear: CET_CELL_SOURCE.academicYear,
      sourceUrl: `${CET_CELL_SOURCE.instituteSummaryBaseUrl}01002`,
    });
  });
});
