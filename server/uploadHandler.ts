import { z } from "zod";
import { storagePut } from "./storage";

/**
 * Upload document file to storage
 */
export async function uploadDocument(
  userId: number,
  file: Buffer,
  fileName: string,
  mimeType: string
) {
  const fileKey = `documents/${userId}/${Date.now()}_${fileName}`;
  
  try {
    const { key, url } = await storagePut(fileKey, file, mimeType);
    
    return {
      success: true,
      key,
      url,
      fileName,
      mimeType,
      size: file.length,
      uploadedAt: new Date(),
    };
  } catch (error) {
    console.error("Document upload failed:", error);
    throw new Error("Failed to upload document");
  }
}

/**
 * Upload selfie file to storage
 */
export async function uploadSelfie(
  userId: number,
  file: Buffer,
  fileName: string,
  mimeType: string
) {
  const fileKey = `selfies/${userId}/${Date.now()}_${fileName}`;
  
  try {
    const { key, url } = await storagePut(fileKey, file, mimeType);
    
    return {
      success: true,
      key,
      url,
      fileName,
      mimeType,
      size: file.length,
      uploadedAt: new Date(),
    };
  } catch (error) {
    console.error("Selfie upload failed:", error);
    throw new Error("Failed to upload selfie");
  }
}

/**
 * Validate file type
 */
export function validateFileType(
  mimeType: string,
  fileType: "document" | "image"
) {
  const allowedTypes = {
    document: ["application/pdf", "image/jpeg", "image/png", "image/webp"],
    image: ["image/jpeg", "image/png", "image/webp", "image/jpg"],
  };

  return allowedTypes[fileType].includes(mimeType);
}

/**
 * Validate file size (max 10MB)
 */
export function validateFileSize(size: number, maxSizeMB: number = 10) {
  const maxBytes = maxSizeMB * 1024 * 1024;
  return size <= maxBytes;
}

/**
 * Generate file key for storage
 */
export function generateFileKey(userId: number, type: "document" | "selfie") {
  return `${type}s/${userId}/${Date.now()}_${Math.random().toString(36).substring(7)}`;
}
