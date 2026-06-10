import { PDFDocument, rgb, degrees } from "pdf-lib";

export interface ReportData {
  verificationId: number;
  verificationCode: string;
  userName: string | null | undefined;
  userEmail: string | null | undefined;
  userPhone: string | null | undefined;
  documentType: string | null | undefined;
  trustScore: number;
  faceMatchScore: string | null | undefined;
  fraudDetectionResult: string | null | undefined;
  status: string;
  verifiedAt: Date | null | undefined;
  expiresAt: Date | null | undefined;
  validityDays: number | null | undefined;
  generatedAt: Date;
}

/**
 * Generate PDF report for verification
 */
export async function generateVerificationPDF(data: ReportData): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const { width, height } = page.getSize();

  const fontSize = 12;
  const titleFontSize = 24;
  const headingFontSize = 14;
  const margin = 40;
  const lineHeight = 20;

  let yPosition = height - margin;

  // Header
  page.drawText("TRUSTLINK VERIFICATION REPORT", {
    x: margin,
    y: yPosition,
    size: titleFontSize,
    color: rgb(15 / 255, 52 / 255, 96 / 255), // #0F3460
    font: await pdfDoc.embedFont("Helvetica-Bold"),
  });

  yPosition -= lineHeight * 2;

  // Verification Status Box
  const statusColor =
    data.status === "verified"
      ? rgb(34 / 255, 197 / 255, 94 / 255) // green
      : rgb(239 / 255, 68 / 255, 68 / 255); // red

  page.drawRectangle({
    x: margin,
    y: yPosition - 30,
    width: width - margin * 2,
    height: 40,
    color: statusColor,
    opacity: 0.1,
  });

  page.drawText(`Status: ${data.status.toUpperCase()}`, {
    x: margin + 10,
    y: yPosition - 20,
    size: headingFontSize,
    color: statusColor,
    font: await pdfDoc.embedFont("Helvetica-Bold"),
  });

  yPosition -= 60;

  // Verification Code and ID
  page.drawText("Verification Details", {
    x: margin,
    y: yPosition,
    size: headingFontSize,
    color: rgb(15 / 255, 52 / 255, 96 / 255),
    font: await pdfDoc.embedFont("Helvetica-Bold"),
  });

  yPosition -= lineHeight * 1.5;

  const details = [
    { label: "Verification Code:", value: data.verificationCode },
    { label: "Verification ID:", value: String(data.verificationId) },
    { label: "Status:", value: data.status },
    { label: "Verified Date:", value: data.verifiedAt ? new Date(data.verifiedAt).toLocaleString() : "N/A" },
    { label: "Expires Date:", value: data.expiresAt ? new Date(data.expiresAt).toLocaleString() : "N/A" },
    { label: "Validity Period:", value: `${data.validityDays} days` },
  ];

  for (const detail of details) {
    page.drawText(detail.label, {
      x: margin,
      y: yPosition,
      size: fontSize,
      color: rgb(0, 0, 0),
      font: await pdfDoc.embedFont("Helvetica-Bold"),
    });

    page.drawText(detail.value, {
      x: margin + 150,
      y: yPosition,
      size: fontSize,
      color: rgb(64 / 255, 64 / 255, 64 / 255),
    });

    yPosition -= lineHeight;
  }

  yPosition -= lineHeight;

  // User Information
  page.drawText("User Information", {
    x: margin,
    y: yPosition,
    size: headingFontSize,
    color: rgb(15 / 255, 52 / 255, 96 / 255),
    font: await pdfDoc.embedFont("Helvetica-Bold"),
  });

  yPosition -= lineHeight * 1.5;

  const userInfo = [
    { label: "Name:", value: data.userName || "N/A" },
    { label: "Email:", value: data.userEmail || "N/A" },
    { label: "Phone:", value: data.userPhone || "N/A" },
  ];

  for (const info of userInfo) {
    page.drawText(info.label, {
      x: margin,
      y: yPosition,
      size: fontSize,
      color: rgb(0, 0, 0),
      font: await pdfDoc.embedFont("Helvetica-Bold"),
    });

    page.drawText(info.value, {
      x: margin + 150,
      y: yPosition,
      size: fontSize,
      color: rgb(64 / 255, 64 / 255, 64 / 255),
    });

    yPosition -= lineHeight;
  }

  yPosition -= lineHeight;

  // Verification Results
  page.drawText("Verification Results", {
    x: margin,
    y: yPosition,
    size: headingFontSize,
    color: rgb(15 / 255, 52 / 255, 96 / 255),
    font: await pdfDoc.embedFont("Helvetica-Bold"),
  });

  yPosition -= lineHeight * 1.5;

  const results = [
    { label: "Document Type:", value: data.documentType || "N/A" },
    { label: "Trust Score:", value: `${data.trustScore}%` },
    { label: "Face Match Score:", value: data.faceMatchScore ? `${data.faceMatchScore}%` : "N/A" },
    { label: "Fraud Detection:", value: data.fraudDetectionResult || "No fraud detected" },
  ];

  for (const result of results) {
    page.drawText(result.label, {
      x: margin,
      y: yPosition,
      size: fontSize,
      color: rgb(0, 0, 0),
      font: await pdfDoc.embedFont("Helvetica-Bold"),
    });

    page.drawText(result.value, {
      x: margin + 150,
      y: yPosition,
      size: fontSize,
      color: rgb(64 / 255, 64 / 255, 64 / 255),
    });

    yPosition -= lineHeight;
  }

  yPosition -= lineHeight * 2;

  // Footer
  page.drawText("This document certifies that the identity verification has been completed successfully.", {
    x: margin,
    y: yPosition,
    size: 10,
    color: rgb(128 / 255, 128 / 255, 128 / 255),
  });

  yPosition -= lineHeight;

  page.drawText(
    `Generated on: ${new Date(data.generatedAt).toLocaleString()}`,
    {
      x: margin,
      y: yPosition,
      size: 10,
      color: rgb(128 / 255, 128 / 255, 128 / 255),
    }
  );

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
