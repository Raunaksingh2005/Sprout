import jsPDF from 'jspdf';
import { MCHAT_QUESTIONS } from '@/data/mchat-questions';
import { ADHD_QUESTIONS } from '@/data/adhd-questions';
import { DYSLEXIA_QUESTIONS } from '@/data/dyslexia-questions';

export interface ReportData {
  childName: string;
  childAge: number;
  childGender: string;
  screeningType?: 'autism' | 'adhd' | 'dyslexia';
  score: number;
  risk: 'Low' | 'Medium' | 'High';
  answers: Record<number, string>;
  parentName?: string;
  date?: string;
  aiSummary?: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function isConcernAutism(answer: string, expected: string): boolean {
  if (!answer || answer === '—') return false;
  if (expected === 'yes') return answer === 'no' || answer === 'sometimes';
  if (expected === 'no') return answer === 'yes' || answer === 'sometimes';
  return false;
}

function formatAge(months: number): string {
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m} months`;
  if (m === 0) return `${y} year${y > 1 ? 's' : ''}`;
  return `${y} year${y > 1 ? 's' : ''} ${m} month${m > 1 ? 's' : ''}`;
}

function genReportId(): string {
  const now = new Date();
  const y = now.getFullYear();
  const mo = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = String(Math.floor(Math.random() * 9999)).padStart(4, '0');
  return `SP-${y}-${mo}${d}-${rand}`;
}

function rRect(doc: jsPDF, x: number, y: number, w: number, h: number, r: number,
  fill: [number,number,number], stroke?: [number,number,number]) {
  doc.setFillColor(...fill);
  if (stroke) { doc.setDrawColor(...stroke); doc.roundedRect(x, y, w, h, r, r, 'FD'); }
  else doc.roundedRect(x, y, w, h, r, r, 'F');
}

// ── Constants ─────────────────────────────────────────────────────────────────

const BLUE: [number,number,number] = [29, 78, 216];
const BLUE_50: [number,number,number] = [239, 246, 255];
const BLUE_200: [number,number,number] = [191, 219, 254];
const GRAY_50: [number,number,number] = [249, 250, 251];
const GRAY_200: [number,number,number] = [229, 231, 235];
const GRAY_500: [number,number,number] = [107, 114, 128];
const GRAY_700: [number,number,number] = [55, 65, 81];
const GRAY_900: [number,number,number] = [17, 24, 39];
const WHITE: [number,number,number] = [255, 255, 255];

const RISK_COLOR: Record<string, [number,number,number]> = {
  Low: [16, 185, 129], Medium: [245, 158, 11], High: [239, 68, 68],
};
const RISK_BG: Record<string, [number,number,number]> = {
  Low: [236, 253, 245], Medium: [255, 251, 235], High: [254, 242, 242],
};
const RISK_BORDER: Record<string, [number,number,number]> = {
  Low: [167, 243, 208], Medium: [253, 230, 138], High: [254, 202, 202],
};

// Per-screening-type category config
const CATEGORY_CONFIG: Record<string, { key: string; label: string; color: [number,number,number] }[]> = {
  autism: [
    { key: 'joint_attention', label: 'Joint Attention', color: [99, 102, 241] },
    { key: 'social_communication', label: 'Social Communication', color: [236, 72, 153] },
    { key: 'behavior', label: 'Repetitive Behaviors', color: [245, 158, 11] },
    { key: 'sensory', label: 'Sensory Sensitivities', color: [20, 184, 166] },
    { key: 'language', label: 'Language Development', color: [59, 130, 246] },
    { key: 'motor', label: 'Motor Skills', color: [16, 185, 129] },
  ],
  adhd: [
    { key: 'inattention', label: 'Inattention', color: [99, 102, 241] },
    { key: 'hyperactivity', label: 'Hyperactivity', color: [236, 72, 153] },
    { key: 'impulsivity', label: 'Impulsivity', color: [245, 158, 11] },
  ],
  dyslexia: [
    { key: 'phonological', label: 'Phonological Awareness', color: [99, 102, 241] },
    { key: 'reading', label: 'Reading', color: [236, 72, 153] },
    { key: 'writing', label: 'Writing & Spelling', color: [245, 158, 11] },
    { key: 'memory', label: 'Memory & Sequencing', color: [20, 184, 166] },
    { key: 'spatial', label: 'Spatial Awareness', color: [59, 130, 246] },
    { key: 'processing', label: 'Processing Speed', color: [16, 185, 129] },
  ],
};

const NEXT_STEPS: Record<string, Record<string, string[]>> = {
  autism: {
    Low: ['Continue regular pediatric checkups and developmental monitoring.', 'Engage in age-appropriate play and social activities.', 'Consider a follow-up M-CHAT-R/F screening in 6 months.'],
    Medium: ['Share this report with your pediatrician within 2–4 weeks.', 'Request a developmental evaluation — ask about Early Intervention.', 'Consider a Speech-Language Pathologist assessment.', 'Schedule a follow-up M-CHAT-R/F screening in 3 months.'],
    High: ['Contact your pediatrician as soon as possible and share this report.', 'Request an urgent developmental evaluation and autism assessment.', 'Ask about Early Intervention services in your area.', 'Seek a referral to a developmental pediatrician or child psychologist.'],
  },
  adhd: {
    Low: ['Continue monitoring your child\'s attention and behaviour at home and school.', 'Maintain consistent routines and clear expectations.', 'Consider a follow-up screening in 6 months if concerns persist.'],
    Medium: ['Share this report with your pediatrician or family doctor.', 'Request a formal ADHD evaluation by a qualified professional.', 'Discuss classroom accommodations with your child\'s teacher.', 'Explore behavioural strategies and structured routines at home.'],
    High: ['Consult your pediatrician or a child psychiatrist as soon as possible.', 'Request a comprehensive ADHD assessment.', 'Ask about evidence-based treatments: behavioural therapy, school support plans.', 'Connect with ADHD parent support groups for guidance.'],
  },
  dyslexia: {
    Low: ['Continue supporting reading and literacy at home with regular practice.', 'Monitor progress with your child\'s teacher.', 'Consider a follow-up screening in 6 months.'],
    Medium: ['Share this report with your child\'s teacher and school SENCO.', 'Request a formal literacy or educational psychology assessment.', 'Ask about reading support programmes and interventions.', 'Use multi-sensory learning techniques at home.'],
    High: ['Request an urgent educational psychology assessment.', 'Speak with your child\'s school about a formal support plan (IEP/EHCP).', 'Ask about specialist dyslexia tuition and assistive technology.', 'Connect with dyslexia support organisations for resources.'],
  },
};

const PLAIN_SUMMARY: Record<string, Record<string, string>> = {
  autism: {
    Low: 'Based on your responses, your child shows few or no signs typically associated with autism spectrum disorder. This is a reassuring result. Continue regular checkups with your pediatrician.',
    Medium: 'Some patterns were observed that are sometimes seen in children who benefit from additional developmental support. A follow-up evaluation with a healthcare professional would be helpful.',
    High: 'Several patterns commonly associated with autism spectrum disorder were identified. A professional developmental evaluation is strongly recommended. Please share this report with your pediatrician.',
  },
  adhd: {
    Low: 'Based on your responses, your child shows few signs typically associated with ADHD. Continue monitoring and maintain consistent routines.',
    Medium: 'Some patterns associated with attention and hyperactivity were observed. A professional evaluation would help clarify whether additional support is needed.',
    High: 'Multiple indicators associated with ADHD were identified. A comprehensive evaluation by a qualified professional is strongly recommended.',
  },
  dyslexia: {
    Low: 'Based on your responses, your child shows few signs typically associated with dyslexia. Continue supporting literacy development at home.',
    Medium: 'Some patterns associated with reading and language processing were observed. An educational assessment would help identify any support needs.',
    High: 'Multiple indicators associated with dyslexia were identified. An educational psychology assessment is strongly recommended to identify appropriate support.',
  },
};

// ── Main export ───────────────────────────────────────────────────────────────

export function generatePDF(data: ReportData): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210;
  const M = 16;
  const CW = W - M * 2;
  const reportId = genReportId();
  const dateStr = data.date ?? new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const sType = data.screeningType ?? 'autism';
  const SCREENING_NAME = { autism: 'Autism (ASD)', adhd: 'ADHD', dyslexia: 'Dyslexia' }[sType];

  // Pick the right question set
  const questions = sType === 'adhd' ? ADHD_QUESTIONS : sType === 'dyslexia' ? DYSLEXIA_QUESTIONS : MCHAT_QUESTIONS;

  // Build concern map
  const concernMap: Record<number, boolean> = {};
  questions.forEach(q => {
    const ans = data.answers[q.id] ?? '';
    if (sType === 'autism') {
      concernMap[q.id] = isConcernAutism(ans, (q as any).expected);
    } else {
      const val = parseInt(ans || '0');
      concernMap[q.id] = val >= (q as any).threshold;
    }
  });

  // Category stats
  const catStats: Record<string, { total: number; concerns: number }> = {};
  questions.forEach(q => {
    if (!catStats[q.category]) catStats[q.category] = { total: 0, concerns: 0 };
    catStats[q.category].total++;
    if (concernMap[q.id]) catStats[q.category].concerns++;
  });

  // Strengths / concerns
  const strengths = questions.filter(q => !concernMap[q.id] && data.answers[q.id])
    .map(q => (q as any).observation?.pass ?? (q as any).observation?.ok ?? (q as any).shortLabel ?? q.text);
  const concerns = questions.filter(q => concernMap[q.id])
    .map(q => (q as any).observation?.fail ?? (q as any).observation?.concern ?? (q as any).shortLabel ?? q.text);
  const topConcerns = questions.filter(q => concernMap[q.id]).slice(0, 3);
  const categories = CATEGORY_CONFIG[sType] ?? CATEGORY_CONFIG.autism;
  const steps = NEXT_STEPS[sType]?.[data.risk] ?? NEXT_STEPS.autism[data.risk];
  const summaryText = data.aiSummary || PLAIN_SUMMARY[sType]?.[data.risk] || PLAIN_SUMMARY.autism[data.risk];

  // ── PAGE 1 ────────────────────────────────────────────────────────────────

  // Header
  doc.setFillColor(...BLUE);
  doc.rect(0, 0, W, 30, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(...WHITE);
  doc.text('SPROUT REPORT', W / 2, 12, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...BLUE_200);
  doc.text(`${SCREENING_NAME} Screening Summary`, W / 2, 20, { align: 'center' });
  doc.setFontSize(7);
  doc.text(`Report ID: ${reportId}`, W / 2, 27, { align: 'center' });

  let y = 38;

  // Child info
  rRect(doc, M, y, CW, 22, 3, GRAY_50, GRAY_200);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(...GRAY_900);
  doc.text('Child:', M + 5, y + 7); doc.text('Parent:', M + 5, y + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(data.childName, M + 22, y + 7);
  doc.text(data.parentName ?? '—', M + 22, y + 15);
  doc.setFont('helvetica', 'bold');
  doc.text('Age:', M + CW / 2, y + 7); doc.text('Date:', M + CW / 2, y + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(formatAge(data.childAge), M + CW / 2 + 14, y + 7);
  doc.text(dateStr, M + CW / 2 + 14, y + 15);
  y += 28;

  // Disclaimer
  rRect(doc, M, y, CW, 18, 3, [255, 251, 235], [253, 230, 138]);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5); doc.setTextColor(146, 64, 14);
  doc.text('IMPORTANT DISCLAIMER', M + 5, y + 6);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(120, 53, 15);
  doc.text(doc.splitTextToSize('This is a screening tool ONLY. It does NOT provide a medical diagnosis. Only qualified healthcare professionals can diagnose these conditions. Always consult your doctor.', CW - 10), M + 5, y + 12);
  y += 24;

  // Score card
  rRect(doc, M, y, CW, 42, 3, RISK_BG[data.risk], RISK_BORDER[data.risk]);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(...GRAY_700);
  doc.text(`${SCREENING_NAME.toUpperCase()} SCORE`, M + 5, y + 8);
  doc.setFontSize(26); doc.setTextColor(...RISK_COLOR[data.risk]);
  doc.text(`${data.score}/${questions.length}`, M + 5, y + 22);
  doc.setFontSize(10);
  doc.text(`RISK LEVEL: ${data.risk.toUpperCase()}`, M + 5, y + 30);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(...GRAY_700);
  const rDesc = { Low: 'No significant concerns detected.', Medium: 'Some patterns observed — evaluation recommended.', High: 'Multiple concerns — professional evaluation strongly recommended.' }[data.risk];
  doc.text(rDesc, M + 5, y + 37);

  // Scale bar
  const bx = M + CW / 2 + 8, bw = CW / 2 - 12, by = y + 12;
  const lowPct = sType === 'autism' ? 0.1 : 0.17;
  const midPct = sType === 'autism' ? 0.25 : 0.28;
  doc.setFillColor(16, 185, 129); doc.roundedRect(bx, by, bw * lowPct, 5, 2, 2, 'F');
  doc.setFillColor(245, 158, 11); doc.rect(bx + bw * lowPct, by, bw * midPct, 5, 'F');
  doc.setFillColor(239, 68, 68); doc.roundedRect(bx + bw * (lowPct + midPct), by, bw * (1 - lowPct - midPct), 5, 2, 2, 'F');
  const markerX = bx + bw * (data.score / questions.length);
  doc.setFillColor(...GRAY_900); doc.triangle(markerX - 2, by + 7, markerX + 2, by + 7, markerX, by + 5, 'F');
  doc.setFont('helvetica', 'normal'); doc.setFontSize(6); doc.setTextColor(...GRAY_500);
  doc.text('Low', bx, by + 11); doc.text('Medium', bx + bw * 0.25, by + 11); doc.text('High', bx + bw * 0.65, by + 11);
  y += 48;

  // Summary
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(...GRAY_900);
  doc.text('SUMMARY', M, y); y += 5;
  const summaryLines = doc.splitTextToSize(summaryText, CW - 4);
  const summaryH = summaryLines.length * 5 + 8;
  rRect(doc, M, y, CW, summaryH, 3, BLUE_50);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(...BLUE);
  doc.text(summaryLines, M + 5, y + 7);
  y += summaryH + 6;

  // Domain breakdown chart
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(...GRAY_900);
  doc.text('DOMAIN BREAKDOWN', M, y); y += 5;
  const chartH = categories.length * 13 + 14;
  rRect(doc, M, y, CW, chartH, 3, GRAY_50, GRAY_200);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); doc.setTextColor(...GRAY_500);
  doc.text('Domain', M + 4, y + 6); doc.text('Concerns / Total', M + CW - 28, y + 6);
  const chartBarX = M + 52, chartBarW = CW - 88;
  categories.forEach(({ key, label, color }, ci) => {
    const stat = catStats[key];
    if (!stat) return;
    const pct = stat.concerns / stat.total;
    const status = pct === 0 ? 'Good' : pct <= 0.4 ? 'Monitor' : pct <= 0.7 ? 'Concern' : 'Significant';
    const statusColor: [number,number,number] = pct === 0 ? [16,185,129] : pct <= 0.4 ? [245,158,11] : pct <= 0.7 ? [249,115,22] : [239,68,68];
    const rowY = y + 10 + ci * 13;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(...GRAY_700);
    doc.text(label, M + 4, rowY + 5);
    doc.setFillColor(...GRAY_200); doc.roundedRect(chartBarX, rowY, chartBarW, 6, 3, 3, 'F');
    if (pct > 0) {
      doc.setFillColor(...color); doc.roundedRect(chartBarX, rowY, chartBarW * pct, 6, 3, 3, 'F');
      if (chartBarW * pct > 12) {
        doc.setFont('helvetica', 'bold'); doc.setFontSize(5.5); doc.setTextColor(...WHITE);
        doc.text(`${Math.round(pct * 100)}%`, chartBarX + chartBarW * pct - 2, rowY + 4.5, { align: 'right' });
      }
    }
    doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(...GRAY_900);
    doc.text(`${stat.concerns}/${stat.total}`, M + CW - 30, rowY + 5);
    doc.setTextColor(...statusColor); doc.text(status, M + CW - 18, rowY + 5);
  });
  y += chartH + 6;

  // Key areas
  if (topConcerns.length > 0) {
    if (y > 230) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(...GRAY_900);
    doc.text('KEY AREAS TO DISCUSS WITH YOUR DOCTOR', M, y); y += 5;
    topConcerns.forEach((q, i) => {
      rRect(doc, M, y, CW, 12, 2, [254, 242, 242], [254, 202, 202]);
      doc.setFillColor(239, 68, 68); doc.circle(M + 6, y + 6, 3.5, 'F');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(...WHITE);
      doc.text(String(i + 1), M + 6, y + 7.5, { align: 'center' });
      doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5); doc.setTextColor(153, 27, 27);
      doc.text((q as any).shortLabel ?? q.text, M + 13, y + 5);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(185, 28, 28);
      const obs = (q as any).observation?.fail ?? (q as any).observation?.concern ?? '';
      if (obs) doc.text(obs, M + 13, y + 10);
      y += 14;
    });
    y += 2;
  }

  // What we observed
  if (y > 220) { doc.addPage(); y = 20; }
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(...GRAY_900);
  doc.text('WHAT WE OBSERVED', M, y); y += 5;
  const showStrengths = strengths.slice(0, 5);
  const sH = showStrengths.length * 6 + 12;
  rRect(doc, M, y, CW, sH, 3, [236, 253, 245], [167, 243, 208]);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(6, 95, 70);
  doc.text('Areas of strength:', M + 5, y + 7);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5);
  showStrengths.forEach((s, i) => doc.text(`\u2022  ${s}`, M + 7, y + 13 + i * 6));
  y += sH + 5;
  if (concerns.length > 0) {
    if (y > 240) { doc.addPage(); y = 20; }
    const showConcerns = concerns.slice(0, 6);
    const cH = showConcerns.length * 6 + 12;
    rRect(doc, M, y, CW, cH, 3, [254, 242, 242], [254, 202, 202]);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(153, 27, 27);
    doc.text('Areas for monitoring:', M + 5, y + 7);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5);
    showConcerns.forEach((c, i) => doc.text(`\u2022  ${c}`, M + 7, y + 13 + i * 6));
    y += cH + 5;
  }

  // ── PAGE 2 ────────────────────────────────────────────────────────────────
  doc.addPage(); y = 20;

  // Next steps
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(...GRAY_900);
  doc.text('RECOMMENDED NEXT STEPS', M, y); y += 6;
  steps.forEach((step, i) => {
    rRect(doc, M, y, CW, 13, 3, GRAY_50, GRAY_200);
    doc.setFillColor(...BLUE); doc.circle(M + 6, y + 6.5, 3.5, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.setTextColor(...WHITE);
    doc.text(String(i + 1), M + 6, y + 8, { align: 'center' });
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(...GRAY_900);
    doc.text(doc.splitTextToSize(step, CW - 18)[0], M + 13, y + 8);
    y += 15;
  });
  y += 4;

  // Question table
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(...GRAY_900);
  doc.text('DETAILED QUESTION RESPONSES', M, y); y += 5;

  const drawTableHeader = () => {
    rRect(doc, M, y, CW, 8, 2, BLUE);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5); doc.setTextColor(...WHITE);
    doc.text('#', M + 3, y + 5.5);
    doc.text('Question', M + 12, y + 5.5);
    doc.text('Answer', M + CW - 32, y + 5.5);
    doc.text('Pts', M + CW - 8, y + 5.5);
    y += 9;
  };
  drawTableHeader();

  questions.forEach((q, idx) => {
    if (y > 265) { doc.addPage(); y = 20; drawTableHeader(); }
    const concern = concernMap[q.id];
    const ans = data.answers[q.id] ?? '—';
    const ansLabel = ans.charAt(0).toUpperCase() + ans.slice(1);
    const rowBg: [number,number,number] = concern ? [254, 242, 242] : idx % 2 === 0 ? GRAY_50 : WHITE;
    rRect(doc, M, y, CW, 9, 1, rowBg);
    if (concern) { doc.setDrawColor(254, 202, 202); doc.roundedRect(M, y, CW, 9, 1, 1, 'S'); }
    doc.setFont('helvetica', 'bold'); doc.setFontSize(7);
    doc.setTextColor(concern ? 185 : 107, concern ? 28 : 114, concern ? 28 : 128);
    doc.text(`Q${String(idx + 1).padStart(2, '0')}`, M + 3, y + 6);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(...GRAY_900);
    doc.text(doc.splitTextToSize((q as any).shortLabel ?? q.text, CW - 52)[0], M + 12, y + 6);
    doc.setFont('helvetica', concern ? 'bold' : 'normal');
    doc.setTextColor(concern ? 185 : 55, concern ? 28 : 65, concern ? 28 : 81);
    doc.text(ansLabel, M + CW - 32, y + 6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(concern ? 185 : 107, concern ? 28 : 114, concern ? 28 : 128);
    doc.text(concern ? '1' : '0', M + CW - 8, y + 6);
    y += 10;
  });

  // Total row
  rRect(doc, M, y, CW, 10, 2, BLUE);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(...WHITE);
  doc.text('TOTAL SCORE', M + 5, y + 7);
  doc.text(`${data.score} / ${questions.length} points`, M + CW - 5, y + 7, { align: 'right' });
  y += 12;

  // Scoring note
  rRect(doc, M, y, CW, 9, 2, [255, 251, 235], [253, 230, 138]);
  doc.setFont('helvetica', 'italic'); doc.setFontSize(7); doc.setTextColor(120, 53, 15);
  const note = sType === 'autism'
    ? '\u2139  Note: "Sometimes" responses are scored as potential concerns per M-CHAT-R/F clinical guidelines.'
    : '\u2139  Note: Scores reflect frequency of observed behaviours. Higher frequency = higher concern.';
  doc.text(note, M + 4, y + 6);
  y += 13;

  // Resources
  if (y > 240) { doc.addPage(); y = 20; }
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(...GRAY_900);
  doc.text('RESOURCES', M, y); y += 5;
  const resources = [
    'Developmental Pediatrician — ask your family doctor for a referral',
    'Early Intervention Program — contact your local health authority',
    'Speech-Language Pathologist — request via your insurance provider',
    'Parent Support Groups — search for local groups in your area',
    'Visit sprout.app/resources for personalised links and guidance',
  ];
  const resH = resources.length * 7 + 10;
  rRect(doc, M, y, CW, resH, 3, GRAY_50, GRAY_200);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(...GRAY_700);
  resources.forEach((r, i) => doc.text(`\u2022  ${r}`, M + 5, y + 8 + i * 7));

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFillColor(...GRAY_50); doc.rect(0, 284, W, 13, 'F');
    doc.setDrawColor(...GRAY_200); doc.line(0, 284, W, 284);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5); doc.setTextColor(148, 163, 184);
    doc.text('Sprout  \u00B7  For screening purposes only  \u00B7  Not a medical diagnosis  \u00B7  Always consult a qualified healthcare professional', M, 290);
    doc.text(`Page ${i} of ${pageCount}  \u00B7  ${reportId}`, W - M, 290, { align: 'right' });
  }

  doc.save(`Sprout_${data.childName.replace(/\s+/g, '_')}_${reportId}.pdf`);
}
