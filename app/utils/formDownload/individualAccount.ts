"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDate, formatDateTime } from "../Utility/reUsableFunction";

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const BRAND_COLOR: [number, number, number] = [222, 79, 1];
const BANK_NAME = "Imperial Homes Mortgage Bank Limited";
const LOGO_PATH = "/images/imperialLogo.png";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
interface Referee {
  name?: string;
  mobileNumber?: string;
  emailAddress?: string;
  bankName?: string;
  accountType?: string;
  accountNumber?: string;
  accountName?: string;
  knownPeriod?: string;
  comment?: string;
  address?: string;
  signature?: string;
}

interface Documents {
  passport?: string;
  validId?: string;
  signature?: string;
  utilityBill?: string;
  createdAt?: string;
}

export interface AccountInformation {
  accountNumber?: string;
  accountTypeId?: string | number;
  firstname?: string;
  middleName?: string;
  lastname?: string;
  bvn?: string;
  nin?: string;
  gender?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  mobilePhoneNumber?: string;
  origin?: string;
  lga?: string;
  email?: string;
  debitCard?: boolean;
  motherMaidenName?: string;
  maritalStatus?: string;
  employmentStatus?: string;
  employer?: string;
  address?: string;
  nextOfKinName?: string;
  nextOfKinRelationship?: string;
  nextOfKinPhoneNumber?: string;
  nextOfKinAddress?: string;
  accountOfficer?: string;
  referee?: Referee[];
  documents?: Documents[];
  status?: string;
  createdAt?: string;
  // Corporate-specific
  companyName?: string;
  rcNumber?: string;
  businessType?: string;
  incorporationDate?: string;
  companyAddress?: string;
  companyEmail?: string;
  companyPhone?: string;
  directors?: { name?: string; phone?: string; email?: string; bvn?: string }[];
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

/* ─────────────────────────────────────────
   FILE TYPE HELPER
───────────────────────────────────────── */
function getFileType(url: string): "image" | "pdf" | "office" | "other" {
  const clean = url.split("?")[0].toLowerCase();
  if (/\.(jpg|jpeg|png|gif|webp|bmp)$/.test(clean)) return "image";
  if (clean.endsWith(".pdf")) return "pdf";
  if (/\.(doc|docx|xls|xlsx|ppt|pptx)$/.test(clean)) return "office";
  // also check data URIs
  if (url.startsWith("data:image/")) return "image";
  if (url.startsWith("data:application/pdf")) return "pdf";
  return "other";
}

/* ─────────────────────────────────────────
   DRAWING HELPERS
───────────────────────────────────────── */

/** Orange section header bar */
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

/** Two-column key/value row with border */
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

/** Checks if current Y is too close to bottom; adds new page if so */
function checkPageBreak(doc: jsPDF, y: number, needed = 30): number {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (y + needed > pageHeight - 40) {
    doc.addPage();
    return 60;
  }
  return y;
}

/* ─────────────────────────────────────────
   FULL-PAGE HEADER
───────────────────────────────────────── */
async function drawPageHeader(
  doc: jsPDF,
  accountType: string,
  accountInfo: AccountInformation,
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
  doc.text("Account Opening Form", 92, 56);

  doc.setTextColor(0, 0, 0);

  let y = 85;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(`Account Type:`, 40, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${accountType} Account`, 110, y);

  doc.setFont("helvetica", "bold");
  doc.text(`Status:`, pageWidth / 2 - 30, y);
  doc.setFont("helvetica", "normal");
  doc.text(accountInfo.status || "PENDING", pageWidth / 2 + 2, y);

  doc.setFont("helvetica", "bold");
  doc.text(`Date:`, pageWidth - 160, y);
  doc.setFont("helvetica", "normal");
  doc.text(formatDateTime(accountInfo.createdAt) || "-", pageWidth - 135, y);

  return y + 10;
}

/* ─────────────────────────────────────────
   CUSTOMER INFO CARD  (with passport photo)
───────────────────────────────────────── */
async function drawCustomerCard(
  doc: jsPDF,
  accountInfo: AccountInformation,
  y: number,
  pageWidth: number
): Promise<number> {
  const passportSize = 75;
  const passportX = pageWidth - 40 - passportSize;
  const cardStartY = y;

  y = drawSectionHeader(doc, "Customer Information", y, pageWidth);

  const rowH = 18;

  const rows = [
    [
      ["Firstname:", accountInfo.firstname || "-"],
      ["Lastname:", accountInfo.lastname || "-"],
    ],
    [
      ["Middlename:", accountInfo.middleName || "-"],
      ["Account No: ", accountInfo.accountNumber || "-"],
    ],
    [
       ["BVN:", accountInfo.bvn || "-"],
      ["NIN:", accountInfo.nin || "-"],
    ],
    [
      ["Gender:", accountInfo.gender || "-"],
      ["Phone:", accountInfo.phoneNumber || "-"],
    ],
    [
      ["Middle Name:", accountInfo.middleName || "-"],
      ["Email:", accountInfo.email || "-"],
    ],
  ];

  rows.forEach(([left, right]) => {
    const narrowW = passportX - 40 - 10;
    const halfW = narrowW / 2;

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.rect(40, y, halfW, rowH);
    doc.rect(40 + halfW, y, halfW, rowH);

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(left[0], 46, y + 12);

    doc.setFont("helvetica", "normal");
    const leftValueX = 46 + doc.getTextWidth(left[0]) + 4;
    const leftValue = doc.splitTextToSize(
      left[1] || "-",
      halfW - doc.getTextWidth(left[0]) - 12
    )[0];
    doc.text(leftValue, leftValueX, y + 12);

    doc.setFont("helvetica", "bold");
    const rightCellX = 40 + halfW + 6;
    doc.text(right[0], rightCellX, y + 12);

    doc.setFont("helvetica", "normal");
    const rightValueX = rightCellX + doc.getTextWidth(right[0]) + 4;
    const rightValue = doc.splitTextToSize(
      right[1] || "-",
      halfW - doc.getTextWidth(right[0]) - 12
    )[0];
    doc.text(rightValue, rightValueX, y + 12);

    y += rowH;
  });

  // Passport box
  const passportY = cardStartY + 18 + 2;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.rect(passportX, passportY, passportSize, passportSize + 10);

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Passport", passportX + passportSize / 2, passportY + 8, { align: "center" });

  const passportUrl = accountInfo.documents?.[0]?.passport;
  if (passportUrl) {
    try {
      const imgB64 = await loadImageAsBase64(passportUrl);
      doc.addImage(imgB64, "JPEG", passportX + 3, passportY + 12, passportSize - 6, passportSize - 6);
    } catch {
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text("Photo unavailable", passportX + passportSize / 2, passportY + passportSize / 2, { align: "center" });
      doc.setTextColor(0, 0, 0);
    }
  } else {
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text("No Photo", passportX + passportSize / 2, passportY + passportSize / 2, { align: "center" });
    doc.setTextColor(0, 0, 0);
  }

  return Math.max(y, passportY + passportSize + 12) + 6;
}

/* ─────────────────────────────────────────
   GENERIC SECTION (key/value rows)
───────────────────────────────────────── */
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
   DOCUMENT IMAGE / LINK PAGE  (updated)
───────────────────────────────────────── */
async function drawDocumentPage(
  doc: jsPDF,
  title: string,
  url: string | undefined,
  pageWidth: number,
  pageHeight: number
) {
  doc.addPage();
  drawSectionHeader(doc, title, 40, pageWidth);

  // ── No document submitted ──
  if (!url) {
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`${title} was not submitted.`, 40, 90);
    doc.setTextColor(0, 0, 0);
    return;
  }

  const fileType = getFileType(url);

  // ── Renderable image ──
  if (fileType === "image") {
    try {
      const imgB64 = await loadImageAsBase64(url);
      const imgType = imgB64.startsWith("data:image/png") ? "PNG" : "JPEG";
      const imageWidth = pageWidth * 0.9;
      const imageHeight = pageHeight * 0.5;
      const x = (pageWidth - imageWidth) / 2;
      const y = 90;
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.5);
      doc.rect(x, y, imageWidth, imageHeight);
      doc.addImage(imgB64, imgType, x, y, imageWidth, imageHeight);
      return;
    } catch {
      // fall through to link fallback below
    }
  }

  // ── Non-image file (PDF / Office / unknown) OR image load failed ──
  // Draw a styled link box so the admin can click through
  const boxX = 40;
  const boxY = 80;
  const boxW = pageWidth - 80;
  const boxH = 110;

  // Light orange tinted background
  doc.setFillColor(255, 243, 237);
  doc.setDrawColor(...BRAND_COLOR);
  doc.setLineWidth(0.8);
  doc.roundedRect(boxX, boxY, boxW, boxH, 6, 6, "FD");

  // Icon label
  const icon =
    fileType === "pdf"
      ? "PDF Document"
      : fileType === "office"
        ? "Office Document"
        : "Attached Document";

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...BRAND_COLOR);
  doc.text(icon, boxX + 14, boxY + 24);

  // Instruction
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text(
    "This document cannot be previewed inline. Click the link below to open it:",
    boxX + 14,
    boxY + 42
  );

  // Clickable URL (jsPDF link annotation)
  const displayUrl = url.length > 80 ? url.slice(0, 77) + "..." : url;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...BRAND_COLOR);
  doc.textWithLink(displayUrl, boxX + 14, boxY + 62, { url });

  // Underline the link manually
  const linkTextWidth = doc.getTextWidth(displayUrl);
  doc.setDrawColor(...BRAND_COLOR);
  doc.setLineWidth(0.4);
  doc.line(boxX + 14, boxY + 64, boxX + 14 + linkTextWidth, boxY + 64);

  // Copy-hint note
  doc.setFontSize(8);
  doc.setTextColor(130, 130, 130);
  doc.text(
    "If the link is not clickable, copy the URL above into your browser.",
    boxX + 14,
    boxY + 82
  );

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
}

/* ─────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────── */
export const downloadIndividualAccountForm = async (
  accountInformation: AccountInformation,
  accountType: string
) => {
  const doc = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
  doc.setFont("helvetica", "normal");

  const PAGE_WIDTH = doc.internal.pageSize.getWidth();
  const PAGE_HEIGHT = doc.internal.pageSize.getHeight();

  /* ── PAGE 1: Header ── */
  let y = await drawPageHeader(doc, accountType, accountInformation, PAGE_WIDTH);

  /* ── Customer card with passport ── */
  y = await drawCustomerCard(doc, accountInformation, y + 4, PAGE_WIDTH);

  /* ── Personal Information ── */
  y = drawSection(doc, "Personal Information", [
    ["Mother Maiden Name", accountInformation.motherMaidenName || "-"],
    ["Marital Status", accountInformation.maritalStatus || "-"],
    ["Employment Status", accountInformation.employmentStatus || "-"],
    ["Employer", accountInformation.employer || "-"],
    ["State of Origin", accountInformation.origin || "-"],
    ["Local Government", accountInformation.lga || "-"],
    ["Current House Address", accountInformation.address || "-"],
    ["Date of Birth", formatDate(accountInformation.dateOfBirth) || "-"],
    ["Debit Card Requested", accountInformation.debitCard ? "YES" : "NO"],
    ["Account Officer", accountInformation.accountOfficer || "-"],
  ], y, PAGE_WIDTH);

  /* ── Next of Kin ── */
  y = drawSection(doc, "Next of Kin", [
    ["Name", accountInformation.nextOfKinName || "-"],
    ["Relationship", accountInformation.nextOfKinRelationship || "-"],
    ["Phone", accountInformation.nextOfKinPhoneNumber || "-"],
    ["Address", accountInformation.nextOfKinAddress || "-"],
  ], y, PAGE_WIDTH);

  /* ── Corporate-specific fields (only if present) ── */
  if (accountInformation.companyName || accountInformation.rcNumber) {
    y = drawSection(doc, "Corporate / Business Information", [
      ["Company Name", accountInformation.companyName || "-"],
      ["RC Number", accountInformation.rcNumber || "-"],
      ["Business Type", accountInformation.businessType || "-"],
      ["Incorporation Date", formatDate(accountInformation.incorporationDate) || "-"],
      ["Company Address", accountInformation.companyAddress || "-"],
      ["Company Email", accountInformation.companyEmail || "-"],
      ["Company Phone", accountInformation.companyPhone || "-"],
    ], y, PAGE_WIDTH);
  }

  /* ── Directors (corporate) ── */
  if (accountInformation.directors?.length) {
    accountInformation.directors.forEach((dir, i) => {
      y = drawSection(doc, `Director ${i + 1}`, [
        ["Name", dir.name || "-"],
        ["Phone", dir.phone || "-"],
        ["Email", dir.email || "-"],
        ["BVN", dir.bvn || "-"],
      ], y, PAGE_WIDTH);
    });
  }

  /* ── Bank Account Referees (current accounts) ── */
  if (accountType === "Current" && accountInformation.referee?.length) {
    accountInformation.referee.forEach((ref, i) => {
      y = drawSection(doc, `Bank Account Referee ${i + 1}`, [
        ["Name", ref.name || "-"],
        ["Mobile", ref.mobileNumber || "-"],
        ["Email", ref.emailAddress || "-"],
        ["Bank Name", ref.bankName || "-"],
        ["Account Name", ref.accountName || "-"],
        ["Account Number", ref.accountNumber || "-"],
        ["Account Type", ref.accountType || "-"],
        ["Known Period", ref.knownPeriod || "-"],
        ["Comment", ref.comment || "-"],
        ["Address", ref.address || "-"],
      ], y, PAGE_WIDTH);
    });
  }

  /* ── Footer on page 1 ── */
  doc.setPage(1);
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(`Generated on ${new Date().toLocaleString()}`, 40, PAGE_HEIGHT - 20);
  doc.setTextColor(0, 0, 0);

  /* ── Document pages (Valid ID / Signature / Utility Bill) ── */
  const latestDoc = accountInformation.documents?.[0];

  await drawDocumentPage(doc, "Valid ID", latestDoc?.validId, PAGE_WIDTH, PAGE_HEIGHT);
  await drawDocumentPage(doc, "Signature", latestDoc?.signature, PAGE_WIDTH, PAGE_HEIGHT);
  await drawDocumentPage(doc, "Utility Bill", latestDoc?.utilityBill, PAGE_WIDTH, PAGE_HEIGHT);

  /* ── Page numbers on all pages ── */
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${totalPages}`, PAGE_WIDTH / 2, PAGE_HEIGHT - 20, { align: "center" });
    doc.setTextColor(0, 0, 0);
  }

  /* ── Save ── */
  const filename = accountInformation.companyName
    ? `${accountInformation.companyName}-${accountInformation.accountNumber || "account"}.pdf`
    : `${accountInformation.firstname || "User"}-${accountInformation.accountNumber || "account"}.pdf`;

  doc.save(filename);
};