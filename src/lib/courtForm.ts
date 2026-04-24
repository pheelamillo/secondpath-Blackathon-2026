import { PDFDocument, rgb, StandardFonts, type PDFPage, type PDFFont } from 'pdf-lib';
import type { IntakeData, EligibilityResult } from '../types';

const BLACK = rgb(0, 0, 0);
const GRAY = rgb(0.45, 0.45, 0.45);
const DARK = rgb(0.1, 0.1, 0.1);
const EMERALD = rgb(0.06, 0.73, 0.51);

function txt(page: PDFPage, text: string, x: number, y: number, size: number, font: PDFFont, color = BLACK) {
  page.drawText(text, { x, y, size, font, color });
}

function line(page: PDFPage, x1: number, y1: number, x2: number, y2: number, thickness = 0.5) {
  page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness, color: GRAY });
}

function sectionHeader(page: PDFPage, label: string, x: number, y: number, w: number, boldFont: PDFFont) {
  page.drawRectangle({ x, y: y - 2, width: w, height: 16, color: EMERALD });
  txt(page, label, x + 6, y + 7, 8, boldFont, rgb(1, 1, 1));
}

function fieldBox(
  page: PDFPage, label: string, value: string,
  x: number, y: number, w: number,
  labelFont: PDFFont, valueFont: PDFFont
) {
  page.drawRectangle({
    x, y: y - 14, width: w, height: 20,
    color: rgb(0.97, 0.97, 0.97),
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 0.5,
  });
  txt(page, label, x + 4, y + 2, 6.5, labelFont, GRAY);
  txt(page, value, x + 4, y - 8, 9.5, valueFont, DARK);
}

export async function generateGeorgiaRC1(intake: IntakeData, result: EligibilityResult): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const regular = await doc.embedFont(StandardFonts.Helvetica);

  const page = doc.addPage([612, 792]);
  const W = 612;
  const H = 792;
  const M = 50;
  const innerW = W - M * 2;
  const half = (innerW - 10) / 2;
  const third = (innerW - 20) / 3;

  let y = H - M;

  // ── Dark header bar ──
  page.drawRectangle({ x: 0, y: H - 82, width: W, height: 82, color: rgb(0.04, 0.09, 0.12) });
  txt(page, 'STATE OF GEORGIA', M, H - 28, 7.5, regular, rgb(0.55, 0.55, 0.55));
  txt(page, 'SUPERIOR COURT', M, H - 40, 7.5, regular, rgb(0.55, 0.55, 0.55));
  txt(page, `${(intake.county || 'FULTON').toUpperCase()} COUNTY`, M, H - 52, 7.5, regular, rgb(0.55, 0.55, 0.55));
  txt(page, 'PETITION FOR RECORD RESTRICTION', 178, H - 31, 13, bold, rgb(1, 1, 1));
  txt(page, '(O.C.G.A. § 35-3-37)', 250, H - 46, 9, regular, rgb(0.7, 0.7, 0.7));
  txt(page, 'FORM RC-1  |  SECONDPATH DEMO', 234, H - 60, 8, regular, EMERALD);

  // Case number box
  page.drawRectangle({ x: W - 158, y: H - 76, width: 110, height: 36, color: rgb(1,1,1), borderColor: rgb(0.5,0.5,0.5), borderWidth: 0.5 });
  txt(page, 'CASE NUMBER', W - 153, H - 48, 6.5, regular, GRAY);
  const caseNum = `${(intake.county ?? 'XX').substring(0,3).toUpperCase()}-${new Date().getFullYear()}-DEMO`;
  txt(page, caseNum, W - 153, H - 61, 9, bold, DARK);

  y = H - 102;

  // ── Section 1: Petitioner ──
  sectionHeader(page, 'SECTION 1 — PETITIONER INFORMATION', M, y, innerW, bold);
  y -= 26;

  fieldBox(page, 'FULL LEGAL NAME', 'Marcus J. Williams', M, y, half, regular, bold);
  fieldBox(page, 'DATE OF BIRTH', 'MM / DD / YYYY', M + half + 10, y, half, regular, regular);
  y -= 32;

  fieldBox(page, 'CURRENT ADDRESS', '1234 Peachtree St NW, Apt 5B', M, y, innerW, regular, regular);
  y -= 32;

  fieldBox(page, 'CITY', intake.county === 'Fulton' ? 'Atlanta' : (intake.county || ''), M, y, third, regular, regular);
  fieldBox(page, 'STATE', intake.state || 'Georgia', M + third + 10, y, third, regular, regular);
  fieldBox(page, 'ZIP CODE', '', M + (third + 10) * 2, y, third, regular, regular);
  y -= 32;

  fieldBox(page, 'PHONE NUMBER', '', M, y, half, regular, regular);
  fieldBox(page, 'EMAIL ADDRESS', '', M + half + 10, y, half, regular, regular);
  y -= 40;

  // ── Section 2: Offense ──
  sectionHeader(page, 'SECTION 2 — OFFENSE INFORMATION', M, y, innerW, bold);
  y -= 26;

  fieldBox(page, 'COUNTY OF CONVICTION', intake.county || '', M, y, half, regular, bold);
  fieldBox(page, 'COURT NAME', `${intake.county || ''} County Superior Court`, M + half + 10, y, half, regular, regular);
  y -= 32;

  fieldBox(page, 'OFFENSE / CHARGE', intake.offenseType || '', M, y, half, regular, bold);
  fieldBox(page, 'O.C.G.A. CODE SECTION', '', M + half + 10, y, half, regular, regular);
  y -= 32;

  fieldBox(page, 'DATE OF ARREST', 'MM / DD / YYYY', M, y, third, regular, regular);
  fieldBox(page, 'DATE OF DISPOSITION', 'MM / DD / YYYY', M + third + 10, y, third, regular, regular);
  fieldBox(page, 'YEAR SENTENCE COMPLETED', intake.yearCompleted || '', M + (third + 10) * 2, y, third, regular, bold);
  y -= 32;

  // Disposition checkboxes
  txt(page, 'DISPOSITION:', M, y + 2, 8, bold, DARK);
  const boxes = ['Convicted', 'Acquitted', 'Nolle Prosequi', 'Deferred Adj.'];
  let bx = M + 78;
  for (const b of boxes) {
    page.drawRectangle({ x: bx, y: y - 4, width: 10, height: 10, borderColor: GRAY, borderWidth: 0.7, color: rgb(1,1,1) });
    if (b === 'Convicted') page.drawText('x', { x: bx + 2, y: y - 1, size: 8, font: bold, color: EMERALD });
    txt(page, b, bx + 14, y + 2, 8, regular, DARK);
    bx += 88;
  }
  y -= 28;

  fieldBox(page, 'SENTENCE IMPOSED', 'Probation / Time Served', M, y, half, regular, regular);
  fieldBox(page, 'ARRESTING AGENCY', '', M + half + 10, y, half, regular, regular);
  y -= 40;

  // ── Section 3: Eligibility ──
  sectionHeader(page, 'SECTION 3 — ELIGIBILITY BASIS', M, y, innerW, bold);
  y -= 26;

  const eligible = result.status === 'eligible';
  const waitYears = result.rule?.waitYears ?? 4;
  const yearsWaited = result.yearsWaited;

  page.drawRectangle({
    x: M, y: y - 52, width: innerW, height: 60,
    color: eligible ? rgb(0.93, 0.99, 0.96) : rgb(0.99, 0.97, 0.93),
    borderColor: eligible ? EMERALD : rgb(0.77, 0.63, 0.35),
    borderWidth: 0.8,
  });

  txt(
    page,
    eligible ? 'PETITIONER APPEARS TO MEET ELIGIBILITY REQUIREMENTS' : 'PETITIONER ELIGIBILITY REQUIRES REVIEW',
    M + 10, y + 4, 9, bold,
    eligible ? rgb(0.04, 0.5, 0.35) : rgb(0.6, 0.45, 0.15)
  );

  const lines = [
    `Offense type: ${intake.offenseType || 'N/A'}  |  County: ${intake.county || 'N/A'}, ${intake.state || 'N/A'}`,
    `Required waiting period: ${waitYears} year(s)  |  Years since completion: ${yearsWaited}  |  Meets wait period: ${yearsWaited >= waitYears ? 'Yes' : 'No'}`,
    result.rule ? `Process: ${result.rule.process}  |  Est. timeline: ${result.rule.timeline}  |  Filing fee: ${result.rule.fee}` : 'Consult court clerk for specific eligibility requirements.',
  ];
  lines.forEach((l, i) => txt(page, l, M + 10, y - 12 - i * 13, 7.5, regular, DARK));
  y -= 68;

  // ── Section 4: Signature ──
  sectionHeader(page, 'SECTION 4 — DECLARATION & SIGNATURE', M, y, innerW, bold);
  y -= 24;

  txt(page, 'I declare under penalty of perjury that the information in this petition is true and correct to the best of my knowledge.', M, y, 8, regular, DARK);
  y -= 22;

  line(page, M, y, M + 210, y, 0.7);
  line(page, M + 226, y, M + 320, y, 0.7);
  line(page, M + 336, y, W - M, y, 0.7);
  y -= 11;
  txt(page, 'PETITIONER SIGNATURE', M, y, 7, regular, GRAY);
  txt(page, 'DATE', M + 226, y, 7, regular, GRAY);
  txt(page, 'PRINTED NAME', M + 336, y, 7, regular, GRAY);
  y -= 30;

  // Court use only
  page.drawRectangle({ x: M, y: y - 50, width: innerW, height: 60, color: rgb(0.95, 0.95, 0.95), borderColor: rgb(0.8, 0.8, 0.8), borderWidth: 0.5 });
  txt(page, 'FOR COURT USE ONLY', M + 10, y + 7, 7.5, bold, GRAY);
  line(page, M + 10, y - 6, M + 235, y - 6, 0.5);
  line(page, M + 252, y - 6, W - M - 10, y - 6, 0.5);
  txt(page, 'CLERK / JUDGE SIGNATURE', M + 10, y - 15, 7, regular, GRAY);
  txt(page, 'DATE RECEIVED', M + 252, y - 15, 7, regular, GRAY);
  line(page, M + 10, y - 32, M + 235, y - 32, 0.5);
  line(page, M + 252, y - 32, W - M - 10, y - 32, 0.5);
  txt(page, 'ORDER:  □ GRANTED    □ DENIED', M + 10, y - 43, 7.5, regular, GRAY);
  txt(page, 'HEARING DATE', M + 252, y - 43, 7, regular, GRAY);

  // ── Footer ──
  line(page, M, 44, W - M, 44, 0.5);
  txt(page, 'RC-1 (Rev. 2024) — Generated by SecondPath · This form is for demonstration purposes · Not a substitute for legal advice', M, 32, 6.5, regular, GRAY);
  txt(page, `Generated: ${new Date().toLocaleDateString()}`, W - 148, 32, 6.5, regular, GRAY);

  return doc.save();
}
