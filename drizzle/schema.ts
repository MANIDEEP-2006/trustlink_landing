import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, longtext } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Verifications table - stores all verification records
 */
export const verifications = mysqlTable("verifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  status: mysqlEnum("status", ["pending", "processing", "verified", "rejected", "failed"]).default("pending").notNull(),
  trustScore: int("trustScore").default(0),
  documentType: varchar("documentType", { length: 50 }),
  faceMatchScore: decimal("faceMatchScore", { precision: 5, scale: 2 }),
  fraudDetectionResult: varchar("fraudDetectionResult", { length: 50 }),
  fraudConfidence: decimal("fraudConfidence", { precision: 5, scale: 2 }),
  ocrData: longtext("ocrData"),
  qrCode: text("qrCode"),
  verificationId: varchar("verificationId", { length: 100 }).unique(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type Verification = typeof verifications.$inferSelect;
export type InsertVerification = typeof verifications.$inferInsert;

/**
 * Documents table - stores uploaded identity documents
 */
export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  verificationId: int("verificationId").notNull(),
  userId: int("userId").notNull(),
  documentType: varchar("documentType", { length: 50 }).notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileKey: varchar("fileKey", { length: 255 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  fileSize: int("fileSize"),
  mimeType: varchar("mimeType", { length: 50 }),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

/**
 * Selfies table - stores face images for biometric verification
 */
export const selfies = mysqlTable("selfies", {
  id: int("id").autoincrement().primaryKey(),
  verificationId: int("verificationId").notNull(),
  userId: int("userId").notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileKey: varchar("fileKey", { length: 255 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  fileSize: int("fileSize"),
  mimeType: varchar("mimeType", { length: 50 }),
  faceEmbedding: longtext("faceEmbedding"),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
});

export type Selfie = typeof selfies.$inferSelect;
export type InsertSelfie = typeof selfies.$inferInsert;

/**
 * OCR Results table - stores extracted data from documents
 */
export const ocrResults = mysqlTable("ocrResults", {
  id: int("id").autoincrement().primaryKey(),
  documentId: int("documentId").notNull(),
  verificationId: int("verificationId").notNull(),
  fullName: varchar("fullName", { length: 255 }),
  dateOfBirth: varchar("dateOfBirth", { length: 50 }),
  documentNumber: varchar("documentNumber", { length: 100 }),
  expiryDate: varchar("expiryDate", { length: 50 }),
  issuingCountry: varchar("issuingCountry", { length: 100 }),
  gender: varchar("gender", { length: 20 }),
  address: text("address"),
  extractedData: longtext("extractedData"),
  confidence: decimal("confidence", { precision: 5, scale: 2 }),
  processedAt: timestamp("processedAt").defaultNow().notNull(),
});

export type OcrResult = typeof ocrResults.$inferSelect;
export type InsertOcrResult = typeof ocrResults.$inferInsert;

/**
 * Fraud Detection Results table
 */
export const fraudDetectionResults = mysqlTable("fraudDetectionResults", {
  id: int("id").autoincrement().primaryKey(),
  verificationId: int("verificationId").notNull(),
  documentId: int("documentId"),
  isFraudulent: boolean("isFraudulent").default(false),
  fraudType: varchar("fraudType", { length: 100 }),
  confidence: decimal("confidence", { precision: 5, scale: 2 }),
  detectedIssues: longtext("detectedIssues"),
  recommendations: text("recommendations"),
  analyzedAt: timestamp("analyzedAt").defaultNow().notNull(),
});

export type FraudDetectionResult = typeof fraudDetectionResults.$inferSelect;
export type InsertFraudDetectionResult = typeof fraudDetectionResults.$inferInsert;

/**
 * Trust Score Breakdown table - stores detailed trust score components
 */
export const trustScoreBreakdown = mysqlTable("trustScoreBreakdown", {
  id: int("id").autoincrement().primaryKey(),
  verificationId: int("verificationId").notNull(),
  documentQualityScore: int("documentQualityScore"),
  ocrAccuracyScore: int("ocrAccuracyScore"),
  faceMatchScore: int("faceMatchScore"),
  fraudDetectionScore: int("fraudDetectionScore"),
  documentValidityScore: int("documentValidityScore"),
  totalTrustScore: int("totalTrustScore"),
  calculatedAt: timestamp("calculatedAt").defaultNow().notNull(),
});

export type TrustScoreBreakdown = typeof trustScoreBreakdown.$inferSelect;
export type InsertTrustScoreBreakdown = typeof trustScoreBreakdown.$inferInsert;

/**
 * QR Codes table - stores generated QR codes for verification sharing
 */
export const qrCodes = mysqlTable("qrCodes", {
  id: int("id").autoincrement().primaryKey(),
  verificationId: int("verificationId").notNull(),
  userId: int("userId").notNull(),
  qrCodeData: text("qrCodeData").notNull(),
  qrCodeUrl: text("qrCodeUrl"),
  expiresAt: timestamp("expiresAt"),
  scans: int("scans").default(0),
  lastScannedAt: timestamp("lastScannedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type QrCode = typeof qrCodes.$inferSelect;
export type InsertQrCode = typeof qrCodes.$inferInsert;

/**
 * Verification History table - audit log for all verification activities
 */
export const verificationHistory = mysqlTable("verificationHistory", {
  id: int("id").autoincrement().primaryKey(),
  verificationId: int("verificationId").notNull(),
  userId: int("userId").notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  details: text("details"),
  ipAddress: varchar("ipAddress", { length: 50 }),
  userAgent: text("userAgent"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type VerificationHistory = typeof verificationHistory.$inferSelect;
export type InsertVerificationHistory = typeof verificationHistory.$inferInsert;

/**
 * Admin Logs table - tracks admin actions
 */
export const adminLogs = mysqlTable("adminLogs", {
  id: int("id").autoincrement().primaryKey(),
  adminId: int("adminId").notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  targetType: varchar("targetType", { length: 50 }),
  targetId: int("targetId"),
  details: text("details"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type AdminLog = typeof adminLogs.$inferSelect;
export type InsertAdminLog = typeof adminLogs.$inferInsert;

/**
 * Relations
 */
export const usersRelations = relations(users, ({ many }) => ({
  verifications: many(verifications),
  documents: many(documents),
  selfies: many(selfies),
  qrCodes: many(qrCodes),
  verificationHistory: many(verificationHistory),
}));

export const verificationsRelations = relations(verifications, ({ one, many }) => ({
  user: one(users, {
    fields: [verifications.userId],
    references: [users.id],
  }),
  documents: many(documents),
  selfies: many(selfies),
  ocrResults: many(ocrResults),
  fraudDetectionResults: many(fraudDetectionResults),
  trustScoreBreakdown: many(trustScoreBreakdown),
  qrCodes: many(qrCodes),
  verificationHistory: many(verificationHistory),
}));

export const documentsRelations = relations(documents, ({ one, many }) => ({
  verification: one(verifications, {
    fields: [documents.verificationId],
    references: [verifications.id],
  }),
  user: one(users, {
    fields: [documents.userId],
    references: [users.id],
  }),
  ocrResults: many(ocrResults),
  fraudDetectionResults: many(fraudDetectionResults),
}));

export const selfiesRelations = relations(selfies, ({ one }) => ({
  verification: one(verifications, {
    fields: [selfies.verificationId],
    references: [verifications.id],
  }),
  user: one(users, {
    fields: [selfies.userId],
    references: [users.id],
  }),
}));

export const ocrResultsRelations = relations(ocrResults, ({ one }) => ({
  document: one(documents, {
    fields: [ocrResults.documentId],
    references: [documents.id],
  }),
  verification: one(verifications, {
    fields: [ocrResults.verificationId],
    references: [verifications.id],
  }),
}));

export const fraudDetectionResultsRelations = relations(fraudDetectionResults, ({ one }) => ({
  verification: one(verifications, {
    fields: [fraudDetectionResults.verificationId],
    references: [verifications.id],
  }),
  document: one(documents, {
    fields: [fraudDetectionResults.documentId],
    references: [documents.id],
  }),
}));

export const trustScoreBreakdownRelations = relations(trustScoreBreakdown, ({ one }) => ({
  verification: one(verifications, {
    fields: [trustScoreBreakdown.verificationId],
    references: [verifications.id],
  }),
}));

export const qrCodesRelations = relations(qrCodes, ({ one }) => ({
  verification: one(verifications, {
    fields: [qrCodes.verificationId],
    references: [verifications.id],
  }),
  user: one(users, {
    fields: [qrCodes.userId],
    references: [users.id],
  }),
}));

export const verificationHistoryRelations = relations(verificationHistory, ({ one }) => ({
  verification: one(verifications, {
    fields: [verificationHistory.verificationId],
    references: [verifications.id],
  }),
  user: one(users, {
    fields: [verificationHistory.userId],
    references: [users.id],
  }),
}));

export const adminLogsRelations = relations(adminLogs, ({ one }) => ({
  admin: one(users, {
    fields: [adminLogs.adminId],
    references: [users.id],
  }),
}));
