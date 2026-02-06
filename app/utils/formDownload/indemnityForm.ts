"use client";

import jsPDF from "jspdf";

const BRAND_COLOR = [222, 79, 1];
const BANK_NAME = "Imperial Homes Mortgage Bank Limited";
const LOGO_PATH = "/images/imperialLogo.png";

interface AccountInformation {
  firstname?: string;
  lastname?: string;
  email?: string;
  signature?: string;
  companyName?: string;
}

const loadImageAsBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Image fetch failed");
  }

  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const downloadIndemnityForm = async (
  accountInformation: AccountInformation
) => {
  const doc = new jsPDF({
    orientation: "p",
    unit: "pt",
    format: "a4",
  });
    const holderLabel = accountInformation.companyName
    ? "COMPANY"
    : "ACCOUNT HOLDER";

  const holderName = accountInformation.companyName
    ? accountInformation.companyName
    : `${accountInformation.firstname || "-"} ${
        accountInformation.lastname || "-"
      }`;

  const PAGE_WIDTH = doc.internal.pageSize.getWidth();
  const PAGE_HEIGHT = doc.internal.pageSize.getHeight();
  let yPos = 120;

  doc.setFillColor(...BRAND_COLOR);
  doc.rect(0, 0, PAGE_WIDTH, 80, "F");

  try {
    const logoBase64 = await loadImageAsBase64(LOGO_PATH);
    doc.addImage(logoBase64, "PNG", 40, 18, 45, 45);
  } catch {}

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text(BANK_NAME, 100, 45);

  doc.setFontSize(11);
  doc.text("Email Indemnity Agreement", 100, 63);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont("times", "bold");
  doc.text(
    `${holderLabel}: ${holderName}`,
    40,
    100
  );

  doc.setDrawColor(...BRAND_COLOR);
  doc.setLineWidth(0.5);
  doc.line(40, 110, PAGE_WIDTH - 40, 110);

  const content = `
Imperial Homes Mortgage Bank

By proceeding with this account opening application and accessing any banking services offered by Imperial Homes Mortgage Bank (“the Bank”), I/we hereby agree as follows:

INDEMNITY & CUSTOMER UNDERTAKINGS

I/we authorize the Bank to act on all instructions relating to my/our account(s) received through:
• My/our registered email address
• The Bank’s Internet Banking platform
• The Bank’s Mobile Banking application
• Any other electronic channel approved by the Bank

I/we acknowledge that the Bank may rely on such instructions without further verification, provided they originate from my/our registered or authenticated channels.

I/we agree to fully indemnify and hold the Bank harmless against any loss, liability, damage, cost, or expense arising from:
• Acting on electronic instructions reasonably believed to have been issued by me/us
• Delays, errors, duplication, or misinterpretation of electronically transmitted instructions
• Unauthorized transactions resulting from my/our failure to protect login credentials, passwords, PINs, OTPs, tokens, or devices
• Instructions sent from compromised or unsecured email accounts or devices

I/we accept full responsibility for:
• Keeping all passwords, transaction PINs, OTPs, and access credentials confidential
• Securing my/our email accounts, mobile devices, and digital banking access
• Promptly notifying the Bank of any suspected fraud, loss, or unauthorized access

I/we understand that the Bank shall not be liable for losses arising from:
• My/our negligence or failure to comply with security requirements
• System failures, network disruptions, or third-party service interruptions
• Compliance with applicable laws, regulations, or directives issued by regulatory authorities

This indemnity applies to all banking services, including account operations, digital banking services, funds transfers, payments, and service requests.

This agreement shall remain valid and binding for the duration of my/our banking relationship with the Bank and shall extend to my/our successors and legal representatives.

This indemnity is governed by the law of the Federal Republic of Nigeria and applicable CBN regulations.

ACCEPTANCE

By selecting “I Agree” and proceeding, I/we confirm that:
• I/we have read and understood this Indemnity Agreement
• I/we voluntarily agree to be bound by its terms
• I/we accept responsibility for instructions issued via approved electronic channels
`;

  doc.setFont("times", "normal");
  doc.setFontSize(10);
  const text = doc.splitTextToSize(content, PAGE_WIDTH - 80);
  doc.text(text, 40, yPos);

  yPos += text.length * 12 + 30;

  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.text(
    `Name: ${accountInformation.firstname || "-"} ${
      accountInformation.lastname || "-"
    }`,
    40,
    yPos
  );

  yPos += 20;

  if (accountInformation.signature) {
    try {
      const signatureBase64 = await loadImageAsBase64(
        accountInformation.signature
      );
      doc.text("Signature:", 40, yPos);
      doc.addImage(signatureBase64, "PNG", 40, yPos + 10, 160, 55);
      yPos += 70;
    } catch {
      doc.text("Signature: Unable to load signature image", 40, yPos + 20);
      yPos += 40;
    }
  } else {
    doc.text("Signature: Not Submitted", 40, yPos + 20);
    yPos += 40;
  }

  doc.setFont("times", "normal");
  doc.setFontSize(10);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 40, yPos);

  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(
      `Generated on ${new Date().toLocaleString()}`,
      40,
      PAGE_HEIGHT - 25
    );
  }

  doc.save(
    `${accountInformation.firstname || "User"}-Indemnity-Form.pdf`
  );
};