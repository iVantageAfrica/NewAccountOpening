"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDate, formatDateTime } from "../reUsableFunction";

const BRAND_COLOR = [222, 79, 1]; // #DE4F01
const BANK_NAME = "Imperial Homes Mortgage Bank Limited";
const LOGO_PATH = "/images/imperialLogo.png";


/* =======================
   TYPES
======================= */

interface Referee {
  name?: string;
  mobileNumber?: string;
  emailAddress?: string;
  bankName?: string;
  accountType?: string;
  accountNumber?: string;
  accountName?: string;
}

interface Documents {
  passport?: string;
  validId?: string;
  signature?: string;
  utilityBill?: string;
}

export interface AccountInformation {
  accountNumber?: string;
  firstname?: string;
  middleName?: string;
  lastname?: string;
  bvn?: string;
  nin?: string;
  gender?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  origin?: string;
  lga?: string;
  email?: string;
  debitCard?: boolean;
  motherMaidenName?: string;
  mobilePhoneNumber?: string;
  maritalStatus?: string;
  employmentStatus?: string;
  employer?: string;
  address?: string;
  nextOfKinName?: string;
  nextOfKinRelationship?: string;
  nextOfKinPhoneNumber?: string;
  nextOfKinAddress?: string;
  referee?: Referee[];
  documents?: Documents;
  status?: string;
  createdAt?: string;
}

/* =======================
   PDF GENERATOR
======================= */

export const downloadIndividualAccountForm = (
  accountInformation: AccountInformation,
  accountType: string
) => {
  const doc = new jsPDF({
    orientation: "p",
    unit: "pt",
    format: "a4",
  });

  doc.setFont("times");

  const PAGE_WIDTH = doc.internal.pageSize.getWidth();
  let yPos = 120;

  const tableHeadStyle = { fillColor: BRAND_COLOR, textColor: 255 };
  const tableFont = { fontSize: 11, font: "times" };

  doc.setFillColor(...BRAND_COLOR);
  doc.rect(0, 0, PAGE_WIDTH, 70, "F");

  const logo = new Image();
  logo.src = LOGO_PATH;
  doc.addImage(logo, "PNG", 40, 15, 45, 45);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text(BANK_NAME, 100, 38);

  doc.setFontSize(11);
  doc.text("Account Opening Form", 100, 56);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text(`ACCOUNT TYPE: ${accountType} Account `, 40, 100);

  doc.setFontSize(11);
  doc.text(`STATUS: ${accountInformation.status || "-"}`, 40, 115);
  doc.text(`DATE: ${formatDateTime(accountInformation.createdAt) || "-"}`, 260, 115);
  // dashed separator
  doc.setDrawColor(222, 79, 1);
  doc.setLineWidth(0.5);
  doc.setLineDash([4, 4], 0);
  doc.setDrawColor(222, 79, 1, 0.4);
  doc.line(40, 125, PAGE_WIDTH - 40, 125);
  doc.setLineDash([]);
  yPos = 145;


  autoTable(doc, {
    startY: yPos,
    head: [["Account Information", ""]],
    body: [
      ["First Name", accountInformation.firstname || "-"],
      ["Middle Name", accountInformation.middleName || "-"],
      ["Last Name", accountInformation.lastname || "-"],
      ["Account Number", accountInformation.accountNumber || "-"],
      ["BVN", accountInformation.bvn || "-"],
      ["NIN", accountInformation.nin || "-"],
      ["Gender", accountInformation.gender || "-"],
      ["Date of Birth", formatDate(accountInformation.dateOfBirth) || "-"],
      ["Phone Number", accountInformation.phoneNumber || "-"],
      ["Email Address", accountInformation.email || "-"],
      ["Debit Card Requested", accountInformation.debitCard ? "YES" : "NO"],
    ],
    theme: "grid",
    headStyles: tableHeadStyle,
    styles: tableFont,
  });

  yPos = (doc as any).lastAutoTable.finalY + 20;
  doc.setTextColor(0, 0, 0);


  autoTable(doc, {
    startY: yPos,
    head: [["Personal Information", ""]],
    body: [
      ["Mother Maiden Name", accountInformation.motherMaidenName || "-"],
      ["Current Phone Number", accountInformation.mobilePhoneNumber || "-"],
      ["Marital Status", accountInformation.maritalStatus || "-"],
      ["Employment Status", accountInformation.employmentStatus || "-"],
      ["State of origin", accountInformation.origin || "-"],
      ["Local Government", accountInformation.lga || "-"],
      ["Employer", accountInformation.employer || "-"],
      ["Current House Address", accountInformation.address || "-"],
      ["Next of Kin", accountInformation.nextOfKinName || "-"],
      ["Next of Kin Relationship", accountInformation.nextOfKinRelationship || "-"],
      ["Next of Kin Phone", accountInformation.nextOfKinPhoneNumber || "-"],
      ["Next of Kin Address", accountInformation.nextOfKinAddress || "-"],
    ],
    theme: "grid",
    headStyles: tableHeadStyle,
    styles: tableFont,
  });

  yPos = (doc as any).lastAutoTable.finalY + 20;

  if (accountInformation.referee?.length) {

    autoTable(doc, {
      startY: yPos,
      head: [["Bank Account Reference"]],
      body: [],
      theme: "plain",
      headStyles: {
        fillColor: BRAND_COLOR,
        textColor: 255,
        fontSize: 12,
        font: "times",
        halign: "left",
        cellPadding: 6,
      },
    });

    yPos = (doc as any).lastAutoTable.finalY +0;
    const ref1 = accountInformation.referee[0] || {};
    const ref2 = accountInformation.referee[1] || {};

    autoTable(doc, {
      startY: yPos,
      head: [["", "Referee 1", "Referee 2"]],
      body: [
        ["Name", ref1.name || "-", ref2.name || "-"],
        ["Mobile Number", ref1.mobileNumber || "-", ref2.mobileNumber || "-"],
        ["Email Address", ref1.emailAddress || "-", ref2.emailAddress || "-"],
        ["Account Name", ref1.accountName || "-", ref2.accountName || "-"],
        ["Bank Name", ref1.bankName || "-", ref2.bankName || "-"],
        ["Account Number", ref1.accountNumber || "-", ref2.accountNumber || "-"],
        ["Account Type", ref1.accountType || "-", ref2.accountType || "-"],
      ],
      theme: "grid",
      headStyles: tableHeadStyle,
      styles: tableFont,
      columnStyles: {
        0: { cellWidth: 150 },
      },
    });

    yPos = (doc as any).lastAutoTable.finalY + 20;
  }

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(
      `Generated on ${new Date().toLocaleDateString()}`,
      40,
      doc.internal.pageSize.getHeight() - 30
    );
  }


  doc.save(
    `${accountInformation.firstname}-${accountInformation.accountNumber || "User"}.pdf`
  );
};