import { PDFDocument, rgb } from "pdf-lib";

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
  qrCodeDataUrl?: string; // Base64 encoded QR code image
}

/**
 * Generate PDF report for verification with QR code
 */
export async function generateVerificationPDF(data: ReportData): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const { width, height } = page.getSize();

  const fontSize = 11;
  const titleFontSize = 24;
  const headingFontSize = 14;
  const margin = 40;
  const lineHeight = 18;

  let yPosition = height - margin;

  // Header with logo area
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
      : data.status === "expired"
        ? rgb(234 / 255, 179 / 255, 8 / 255) // yellow
        : rgb(239 / 255, 68 / 255, 68 / 255); // red

  page.drawRectangle({
    x: margin,
    y: yPosition - 35,
    width: width - margin * 2,
    height: 45,
    color: statusColor,
    opacity: 0.15,
  });

  page.drawText(`STATUS: ${data.status.toUpperCase()}`, {
    x: margin + 15,
    y: yPosition - 20,
    size: headingFontSize,
    color: statusColor,
    font: await pdfDoc.embedFont("Helvetica-Bold"),
  });

  yPosition -= 70;

  // Add QR Code if available
  if (data.qrCodeDataUrl) {
    try {
      // Convert data URL to image
      const qrImageBytes = Buffer.from(
        data.qrCodeDataUrl.replace(/^data:image\/png;base64,/, ""),
        "base64"
      );
      const qrImage = await pdfDoc.embedPng(qrImageBytes);

      // Draw QR code on the right side
      const qrSize = 120;
      page.drawImage(qrImage, {
        x: width - margin - qrSize,
        y: yPosition - qrSize - 10,
        width: qrSize,
        height: qrSize,
      });

      // Add label below QR code
      page.drawText("Scan to Verify", {
        x: width - margin - qrSize,
        y: yPosition - qrSize - 35,
        size: 9,
        color: rgb(100 / 255, 100 / 255, 100 / 255),
        font: await pdfDoc.embedFont("Helvetica"),
      });
    } catch (error) {
      console.warn("Failed to embed QR code in PDF:", error);
    }
  }

  // Verification Details Section
  page.drawText("VERIFICATION DETAILS", {
    x: margin,
    y: yPosition,
    size: headingFontSize,
    color: rgb(15 / 255, 52 / 255, 96 / 255),
    font: await pdfDoc.embedFont("Helvetica-Bold"),
  });

  yPosition -= lineHeight * 1.8;

  const verificationDetails = [
    { label: "Verification Code:", value: data.verificationCode },
    { label: "Verification ID:", value: String(data.verificationId) },
    { label: "Status:", value: data.status.toUpperCase() },
    {
      label: "Verified Date:",
      value: data.verifiedAt ? new Date(data.verifiedAt).toLocaleString() : "N/A",
    },
    {
      label: "Expiry Date:",
      value: data.expiresAt ? new Date(data.expiresAt).toLocaleString() : "N/A",
    },
    { label: "Validity Period:", value: `${data.validityDays} days` },
  ];

  for (const detail of verificationDetails) {
    page.drawText(detail.label, {
      x: margin,
      y: yPosition,
      size: fontSize,
      color: rgb(0, 0, 0),
      font: await pdfDoc.embedFont("Helvetica-Bold"),
    });

    page.drawText(detail.value, {
      x: margin + 180,
      y: yPosition,
      size: fontSize,
      color: rgb(64 / 255, 64 / 255, 64 / 255),
    });

    yPosition -= lineHeight;
  }

  yPosition -= lineHeight;

  // User Information Section
  page.drawText("USER INFORMATION", {
    x: margin,
    y: yPosition,
    size: headingFontSize,
    color: rgb(15 / 255, 52 / 255, 96 / 255),
    font: await pdfDoc.embedFont("Helvetica-Bold"),
  });

  yPosition -= lineHeight * 1.8;

  const userInfo = [
    { label: "Full Name:", value: data.userName || "N/A" },
    { label: "Email:", value: data.userEmail || "N/A" },
    { label: "Phone Number:", value: data.userPhone || "N/A" },
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
      x: margin + 180,
      y: yPosition,
      size: fontSize,
      color: rgb(64 / 255, 64 / 255, 64 / 255),
    });

    yPosition -= lineHeight;
  }

  yPosition -= lineHeight;

  // Verification Results Section
  page.drawText("VERIFICATION RESULTS", {
    x: margin,
    y: yPosition,
    size: headingFontSize,
    color: rgb(15 / 255, 52 / 255, 96 / 255),
    font: await pdfDoc.embedFont("Helvetica-Bold"),
  });

  yPosition -= lineHeight * 1.8;

  const results = [
    { label: "Document Type:", value: data.documentType || "N/A" },
    { label: "Trust Score:", value: `${data.trustScore}%` },
    { label: "Face Match Score:", value: data.faceMatchScore ? `${data.faceMatchScore}%` : "N/A" },
    {
      label: "Fraud Detection:",
      value: data.fraudDetectionResult || "No fraud detected",
    },
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
      x: margin + 180,
      y: yPosition,
      size: fontSize,
      color: rgb(64 / 255, 64 / 255, 64 / 255),
    });

    yPosition -= lineHeight;
  }

  yPosition -= lineHeight * 2;

  // Footer
  page.drawLine({
    start: { x: margin, y: yPosition },
    end: { x: width - margin, y: yPosition },
    thickness: 1,
    color: rgb(200 / 255, 200 / 255, 200 / 255),
  });

  yPosition -= lineHeight;

  page.drawText(
    "This document certifies that the identity verification has been completed successfully.",
    {
      x: margin,
      y: yPosition,
      size: 9,
      color: rgb(128 / 255, 128 / 255, 128 / 255),
    }
  );

  yPosition -= lineHeight;

  page.drawText(
    `Generated on: ${new Date(data.generatedAt).toLocaleString()}`,
    {
      x: margin,
      y: yPosition,
      size: 9,
      color: rgb(128 / 255, 128 / 255, 128 / 255),
    }
  );

  yPosition -= lineHeight;

  page.drawText("TrustLink - Smart Digital Identity Verification", {
    x: margin,
    y: yPosition,
    size: 8,
    color: rgb(150 / 255, 150 / 255, 150 / 255),
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
