import QRCode from "qrcode";

/**
 * Generate QR code as data URL
 */
export async function generateQRCode(text: string, size: number = 300): Promise<string> {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(text, {
      errorCorrectionLevel: "H",
      type: "image/png",
      width: size,
      margin: 2,
      color: {
        dark: "#0F3460",
        light: "#FFFFFF",
      },
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error("Failed to generate QR code:", error);
    throw error;
  }
}

/**
 * Generate QR code as canvas
 */
export async function generateQRCodeCanvas(text: string, canvas: HTMLCanvasElement): Promise<void> {
  try {
    await QRCode.toCanvas(canvas, text, {
      errorCorrectionLevel: "H",
      width: 300,
      margin: 2,
      color: {
        dark: "#0F3460",
        light: "#FFFFFF",
      },
    });
  } catch (error) {
    console.error("Failed to generate QR code canvas:", error);
    throw error;
  }
}

/**
 * Download QR code as image
 */
export async function downloadQRCode(text: string, filename: string = "verification-qr.png"): Promise<void> {
  try {
    const qrCodeDataUrl = await generateQRCode(text);
    const link = document.createElement("a");
    link.href = qrCodeDataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Failed to download QR code:", error);
    throw error;
  }
}
