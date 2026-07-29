"use client";

import jsPDF from "jspdf";
import { formatDateTime } from "../Utility/reUsableFunction";

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const BRAND_COLOR: [number, number, number] = [222, 79, 1];
const BANK_NAME = "Imperial Homes Mortgage Bank Limited";
const LOGO_PATH = "/images/imperialLogo.png";

/* Signature box dimensions */
const SIGNATURE_WIDTH = 50;
const SIGNATURE_HEIGHT = 30;

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
export interface ReferenceDetails {
  accountHolderName?: string;
  accountHolderNumber?: string;
  accountHolderEmail?: string;
  name?: string;
  emailAddress?: string;
  mobileNumber?: string;
  address?: string;
  bankName?: string;
  accountType?: string;
  accountName?: string;
  accountNumber?: string;
  knownPeriod?: string;
  comment?: string;
  signature?: string;
  createdAt?: string;
}

/* ─────────────────────────────────────────
   IMAGE HELPER
───────────────────────────────────────── */
const loadImageAsBase64 = async (url: string): Promise<string> => {
  if (!url) throw new Error("No URL");
  if (url.startsWith("data:")) return url;

  const fetchUrl = url.startsWith("http")
    ? `/api/proxy-image?url=${encodeURIComponent(url)}`
    : url;

  const response = await fetch(fetchUrl);
  if (!response.ok) throw new Error("Image fetch failed");

  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

function getFileType(url: string): "image" | "pdf" | "office" | "other" {
  const clean = url.split("?")[0].toLowerCase();
  if (/\.(jpg|jpeg|png|gif|webp|bmp)$/.test(clean)) return "image";
  if (clean.endsWith(".pdf")) return "pdf";
  if (/\.(doc|docx|xls|xlsx|ppt|pptx)$/.test(clean)) return "office";
  if (url.startsWith("data:image/")) return "image";
  if (url.startsWith("data:application/pdf")) return "pdf";
  return "other";
}

/* ─────────────────────────────────────────
   DRAWING HELPERS
───────────────────────────────────────── */
function drawSectionHeader(doc: jsPDF, label: string, y: number, pageWidth: number) {
  doc.setFillColor(...BRAND_COLOR);
  doc.rect(40, y, pageWidth - 80, 18, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(label, 46, y + 12);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  return y + 18;
}

function drawRow(
  doc: jsPDF,
  key: string,
  value: string,
  y: number,
  pageWidth: number,
  rowHeight = 18
) {
  const colW = (pageWidth - 80) / 2;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.rect(40, y, colW, rowHeight);
  doc.rect(40 + colW, y, colW, rowHeight);

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(key, 44, y + 12);

  doc.setFont("helvetica", "normal");
  const maxWidth = colW - 8;
  const safeValue = doc.splitTextToSize(value || "-", maxWidth)[0] ?? "-";
  doc.text(safeValue, 44 + colW, y + 12);

  return y + rowHeight;
}

function checkPageBreak(doc: jsPDF, y: number, needed = 30): number {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (y + needed > pageHeight - 40) {
    doc.addPage();
    return 60;
  }
  return y;
}

function drawSection(
  doc: jsPDF,
  title: string,
  rows: [string, string][],
  y: number,
  pageWidth: number
): number {
  y = checkPageBreak(doc, y, 30 + rows.length * 18);
  y = drawSectionHeader(doc, title, y, pageWidth);
  rows.forEach(([key, val]) => {
    y = checkPageBreak(doc, y, 18);
    y = drawRow(doc, key, val, y, pageWidth);
  });
  return y + 6;
}

/* ─────────────────────────────────────────
   FULL-PAGE HEADER
───────────────────────────────────────── */
async function drawPageHeader(
  doc: jsPDF,
  referenceDetails: ReferenceDetails,
  pageWidth: number
): Promise<number> {
  doc.setFillColor(...BRAND_COLOR);
  doc.rect(0, 0, pageWidth, 72, "F");

  try {
    const logoB64 = await loadImageAsBase64(LOGO_PATH);
    doc.addImage(logoB64, "PNG", 40, 14, 42, 42);
  } catch {
    // silently skip if logo fails
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text(BANK_NAME, 92, 38);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Bank Account Reference Form", 92, 56);

  doc.setTextColor(0, 0, 0);

  let y = 85;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(`Date:`, pageWidth - 160, y);
  doc.setFont("helvetica", "normal");
  doc.text(formatDateTime(referenceDetails.createdAt) || "-", pageWidth - 135, y);

  return y + 10;
}

/* ─────────────────────────────────────────
   INLINE SIGNATURE SECTION (small, same page)
───────────────────────────────────────── */
async function drawSignatureSection(
  doc: jsPDF,
  url: string | undefined,
  y: number,
  pageWidth: number
): Promise<number> {
  // reserve enough room for header + box, or push to next page
  y = checkPageBreak(doc, y, 30 + SIGNATURE_HEIGHT);
  y = drawSectionHeader(doc, "Signature", y, pageWidth);

  const boxY = y + 4;

  if (!url) {
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("Not Yet Submitted", 44, boxY + 12);
    doc.setTextColor(0, 0, 0);
    return boxY + 18;
  }

  const fileType = getFileType(url);

  if (fileType === "image") {
    try {
      const imgB64 = await loadImageAsBase64(url);
      const imgType = imgB64.startsWith("data:image/png") ? "PNG" : "JPEG";

      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.5);
      doc.rect(44, boxY, SIGNATURE_WIDTH, SIGNATURE_HEIGHT);
      doc.addImage(imgB64, imgType, 44, boxY, SIGNATURE_WIDTH, SIGNATURE_HEIGHT);

      return boxY + SIGNATURE_HEIGHT + 6;
    } catch {
      // fall through to link fallback below
    }
  }

  // Non-image / failed-load fallback: compact clickable link line
  const displayUrl = url.length > 60 ? url.slice(0, 57) + "..." : url;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...BRAND_COLOR);
  doc.textWithLink(displayUrl, 44, boxY + 12, { url });

  const linkTextWidth = doc.getTextWidth(displayUrl);
  doc.setDrawColor(...BRAND_COLOR);
  doc.setLineWidth(0.4);
  doc.line(44, boxY + 14, 44 + linkTextWidth, boxY + 14);

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");

  return boxY + 20;
}

/* ─────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────── */
export const downloadReferenceForm = async (referenceDetails: ReferenceDetails) => {
  const doc = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
  doc.setFont("helvetica", "normal");

  const PAGE_WIDTH = doc.internal.pageSize.getWidth();
  const PAGE_HEIGHT = doc.internal.pageSize.getHeight();

  let y = await drawPageHeader(doc, referenceDetails, PAGE_WIDTH);

  y = drawSection(doc, "Account Holder Details", [
    ["Account Name", referenceDetails.accountHolderName || "-"],
    ["Account Number", referenceDetails.accountHolderNumber || "-"],
    ["Account Email", referenceDetails.accountHolderEmail || "-"],
  ], y + 4, PAGE_WIDTH);

  y = drawSection(doc, "Referee Details", [
    ["Referee Name", referenceDetails.name || "-"],
    ["Referee Email", referenceDetails.emailAddress || "-"],
    ["Referee Phone", referenceDetails.mobileNumber || "-"],
    ["Referee Address", referenceDetails.address || "-"],
    ["Referee Bank Name", referenceDetails.bankName || "-"],
    ["Referee Account Type", referenceDetails.accountType || "-"],
    ["Referee Account Name", referenceDetails.accountName || "-"],
    ["Referee Account Number", referenceDetails.accountNumber || "-"],
    ["Known Period", referenceDetails.knownPeriod || "-"],
    ["Comment", referenceDetails.comment || "-"],
  ], y, PAGE_WIDTH);

  /* ── Signature (inline, small, same page) ── */
  y = await drawSignatureSection(doc, referenceDetails.signature, y, PAGE_WIDTH);

  /* Footer on page 1 */
  doc.setPage(1);
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(`Generated on ${new Date().toLocaleString()}`, 40, PAGE_HEIGHT - 20);
  doc.setTextColor(0, 0, 0);

  /* Page numbers */
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${totalPages}`, PAGE_WIDTH / 2, PAGE_HEIGHT - 20, { align: "center" });
    doc.setTextColor(0, 0, 0);
  }

  const filename = `${referenceDetails.name || "Referee"}-reference.pdf`;
  doc.save(filename);
};