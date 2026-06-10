import { eq, and } from "drizzle-orm";
import { getDb } from "./db";
import {
  verifications,
  verificationLookup,
  qrCodes,
  InsertVerification,
  InsertVerificationLookup,
  InsertQrCode,
} from "../drizzle/schema";

/**
 * Create a new verification record
 */
export async function createVerification(data: InsertVerification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(verifications).values(data);
  return result;
}

/**
 * Get verification by ID
 */
export async function getVerificationById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(verifications)
    .where(eq(verifications.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Get verification by verification code (for public lookup)
 */
export async function getVerificationByCode(code: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(verifications)
    .where(eq(verifications.verificationCode, code))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Get all verifications for a user
 */
export async function getUserVerifications(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(verifications)
    .where(eq(verifications.userId, userId));
}

/**
 * Create verification lookup record (for QR scanning)
 */
export async function createVerificationLookup(data: InsertVerificationLookup) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(verificationLookup).values(data);
  return result;
}

/**
 * Get verification lookup by code (public endpoint)
 */
export async function getVerificationLookupByCode(code: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(verificationLookup)
    .where(eq(verificationLookup.verificationCode, code))
    .limit(1);

  if (result.length > 0) {
    const record = result[0];
    // Increment scan count and update last scanned
    await db
      .update(verificationLookup)
      .set({
        scans: (record.scans || 0) + 1,
        lastScannedAt: new Date(),
      })
      .where(eq(verificationLookup.id, record.id));

    return record;
  }

  return null;
}

/**
 * Create QR code record
 */
export async function createQrCode(data: InsertQrCode) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(qrCodes).values(data);
  return result;
}

/**
 * Get QR code by verification ID
 */
export async function getQrCodeByVerificationId(verificationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(qrCodes)
    .where(eq(qrCodes.verificationId, verificationId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Generate unique verification code
 */
export function generateVerificationCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `VER-${timestamp}-${random}`;
}

/**
 * Calculate expiry date based on validity days
 */
export function calculateExpiryDate(validityDays: number = 365): Date {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + validityDays);
  return expiryDate;
}
