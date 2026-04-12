import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CollegeResult } from "./prediction";

interface ExportParams {
  name: string;
  examType: string;
  percentile: string;
  category: string;
  results: CollegeResult[];
}

export function exportResultsPdf({ name, examType, percentile, category, results }: ExportParams) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(79, 70, 229); // indigo-600
  doc.rect(0, 0, pageWidth, 38, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("EduGuide — College Prediction Report", 14, 18);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated on ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`, 14, 28);

  // Student info
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Student Profile", 14, 50);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const info = [
    ["Name", name],
    ["Exam Type", examType],
    ["Percentile", `${percentile}%`],
    ["Category", category],
    ["Total Matches", String(results.length)],
    ["Good Matches (75%+)", String(results.filter((r) => r.matchPercent >= 75).length)],
  ];
  let yPos = 56;
  info.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, 14, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(value, 60, yPos);
    yPos += 6;
  });

  // Top recommendation
  if (results.length > 0) {
    const top = results[0];
    yPos += 6;
    doc.setFillColor(245, 243, 255);
    doc.roundedRect(14, yPos - 5, pageWidth - 28, 22, 3, 3, "F");
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(79, 70, 229);
    doc.text(`Top Recommendation: ${top.name}`, 18, yPos + 3);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(`${top.branch} | ${top.location} | ${top.matchPercent}% Match | Cutoff: ${top.cutoff}%ile`, 18, yPos + 12);
    yPos += 28;
  }

  // Results table
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("All Matched Colleges", 14, yPos + 4);

  autoTable(doc, {
    startY: yPos + 10,
    head: [["#", "College Name", "Branch", "Location", "Type", "Cutoff", "Rating", "Match %"]],
    body: results.map((r, i) => [
      String(i + 1),
      r.name,
      r.branch,
      r.location,
      r.type,
      `${r.cutoff}%ile`,
      r.rating ? `${r.rating}/5` : "N/A",
      `${r.matchPercent}%`,
    ]),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 243, 255] },
    margin: { left: 14, right: 14 },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("EduGuide College Predictor — eduguide.app", 14, doc.internal.pageSize.getHeight() - 10);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, doc.internal.pageSize.getHeight() - 10, { align: "right" });
  }

  doc.save(`EduGuide_Report_${name.replace(/\s+/g, "_")}.pdf`);
}
