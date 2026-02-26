"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDateTime } from "../Utility/reUsableFunction";

const BRAND_COLOR: [number, number, number] = [222, 79, 1];
const BANK_NAME = "Imperial Homes Mortgage Bank Limited";
const LOGO_PATH = "/images/imperialLogo.png";

export const downloadCorporateAccountForm = (
  accountInformation: any,
  accountType: string
) => {
  const doc = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
  const PAGE_WIDTH = doc.internal.pageSize.getWidth();
  let yPos = 120;

  doc.setFont("times");
  const tableHeadStyle = { fillColor: BRAND_COLOR, textColor: 255 };
  const tableFont = { fontSize: 11, font: "times" };

  doc.setFillColor(...BRAND_COLOR);
  doc.rect(0, 0, PAGE_WIDTH, 70, "F");

  const logo = new Image();
  logo.src = LOGO_PATH;
  doc.addImage(logo, "PNG", 40, 15, 45, 45);

  doc.setTextColor(255);
  doc.setFontSize(16);
  doc.text(BANK_NAME, 100, 38);
  doc.setFontSize(11);
  doc.text("Corporate Account Opening Form", 100, 56);

  doc.setTextColor(0);
  doc.text(`ACCOUNT TYPE: ${accountType}`, 40, 100);
  doc.text(`STATUS: ${accountInformation.status || "-"}`, 40, 115);
  doc.text(
    `DATE: ${formatDateTime(accountInformation.createdAt) || "-"}`,
    260,
    115
  );

  yPos = 145;

  /* ================= ACCOUNT INFORMATION ================= */
  autoTable(doc, {
    startY: yPos,
    head: [["Account Information", ""]],
    body: [
      ["Account Number", accountInformation.accountNumber || "-"],
      ["Account Name", accountInformation.companyName || "-"],
      ["First Name", accountInformation.firstname || "-"],
      ["Middle Name", accountInformation.middleName || "-"],
      ["Last Name", accountInformation.lastname || "-"],
      ["BVN", accountInformation.bvn || "-"],
      ["NIN", accountInformation.nin || "-"],
      ["Phone Number", accountInformation.phoneNumber || "-"],
      ["Email Address", accountInformation.email || "-"],
      ["Debit Card", accountInformation.debitCard ? "Yes" : "No"]
    ],
    theme: "grid",
    headStyles: tableHeadStyle,
    styles: tableFont,
  });

  yPos = (doc as any).lastAutoTable.finalY + 20;


  autoTable(doc, {
    startY: yPos,
    head: [["Company Information", ""]],
    body: [
      ["Company Name", accountInformation.companyName || "-"],
      ["Registration Number", accountInformation.registrationNumber || "-"],
      ["Company Type", accountInformation.companyType || "-"],
      ["TIN", accountInformation.tin || "-"],
      ["Business Email", accountInformation.businessEmail || "-"],
      ["Business Phone", accountInformation.phoneNumber || "-"],
      ["City", accountInformation.city || "-"],
      ["State", accountInformation.state || "-"],
      ["LGA", accountInformation.lga || "-"],
      ["Address", accountInformation.companyAddress || "-"],
    ],
    theme: "grid",
    headStyles: tableHeadStyle,
    styles: tableFont,
  });

  yPos = (doc as any).lastAutoTable.finalY + 20;


  const directors = accountInformation.directory?.slice(0, 2) || [];

  if (directors.length) {
    autoTable(doc, {
      startY: yPos,
      head: [["Directors"]],
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

    yPos = (doc as any).lastAutoTable.finalY;

    autoTable(doc, {
      startY: yPos,
      head: [["", "Director 1", "Director 2"]],
      body: [
        [
          "Full Name",
          `${directors[0]?.firstname || "-"} ${directors[0]?.lastname || "-"}`,
          `${directors[1]?.firstname || "-"} ${directors[1]?.lastname || "-"}`,
        ],
        ["Email", directors[0]?.emailAddress || "-", directors[1]?.emailAddress || "-"],
        ["Phone", directors[0]?.phoneNumber || "-", directors[1]?.phoneNumber || "-"],
        ["BVN", directors[0]?.bvn || "-", directors[1]?.bvn || "-"],
        ["NIN", directors[0]?.nin || "-", directors[1]?.nin || "-"],
      ],
      theme: "grid",
      headStyles: tableHeadStyle,
      styles: tableFont,
    });

    yPos = (doc as any).lastAutoTable.finalY + 20;
  }

  /* ================= SIGNATORIES (MAX 2) ================= */
  const signatories = accountInformation.signatory?.slice(0, 2) || [];

  if (signatories.length) {
    autoTable(doc, {
      startY: yPos,
      head: [["Signatories"]],
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

    yPos = (doc as any).lastAutoTable.finalY;

    autoTable(doc, {
      startY: yPos,
      head: [["", "Signatory 1", "Signatory 2"]],
      body: [
        ["Name", signatories[0]?.name || "-", signatories[1]?.name || "-"],
        ["Email", signatories[0]?.emailAddress || "-", signatories[1]?.emailAddress || "-"],
        ["Phone", signatories[0]?.phoneNumber || "-", signatories[1]?.phoneNumber || "-"],
        ["BVN", signatories[0]?.bvn || "-", signatories[1]?.bvn || "-"],
        ["NIN", signatories[0]?.nin || "-", signatories[1]?.nin || "-"],
      ],
      theme: "grid",
      headStyles: tableHeadStyle,
      styles: tableFont,
    });

    yPos = (doc as any).lastAutoTable.finalY + 20;
  }

  /* ================= REFEREES (MAX 2) ================= */
  const referees = accountInformation.referee?.slice(0, 2) || [];

  if (referees.length) {
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

    yPos = (doc as any).lastAutoTable.finalY;

    autoTable(doc, {
      startY: yPos,
      head: [["", "Referee 1", "Referee 2"]],
      body: [
        ["Name", referees[0]?.name || "-", referees[1]?.name || "-"],
        ["Email", referees[0]?.emailAddress || "-", referees[1]?.emailAddress || "-"],
        ["Mobile", referees[0]?.mobileNumber || "-", referees[1]?.mobileNumber || "-"],
        ["Bank Name", referees[0]?.bankName || "-", referees[1]?.bankName || "-"],
        ["Account Name", referees[0]?.accountName || "-", referees[1]?.accountName || "-"],
        ["Account Number", referees[0]?.accountNumber || "-", referees[1]?.accountNumber || "-"],
        ["Account Type", referees[0]?.accountType || "-", referees[1]?.accountType || "-"],
      ],
      theme: "grid",
      headStyles: tableHeadStyle,
      styles: tableFont,
    });

    yPos = (doc as any).lastAutoTable.finalY + 20;
  }

  /* ================= FOOTER ================= */
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(
      `Generated on ${new Date().toLocaleDateString()}`,
      40,
      doc.internal.pageSize.getHeight() - 30
    );
  }

  doc.save(`${accountInformation.companyName}-Corporate-Account.pdf`);
};