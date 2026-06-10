import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  getVerificationById,
  getVerificationByCode,
  getUserVerifications,
  getVerificationLookupByCode,
  createVerification,
  createVerificationLookup,
  createQrCode,
  generateVerificationCode,
  calculateExpiryDate,
} from "./verificationDb";
import { TRPCError } from "@trpc/server";

export const verificationRouter = router({
  /**
   * Create a new verification record (protected)
   */
  create: protectedProcedure
    .input(
      z.object({
        documentType: z.string(),
        faceMatchScore: z.number().optional(),
        trustScore: z.number().default(0),
        fraudDetectionResult: z.string().optional(),
        fraudConfidence: z.number().optional(),
        validityDays: z.number().default(365),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const verificationCode = generateVerificationCode();
      const expiresAt = calculateExpiryDate(input.validityDays);

      await createVerification({
        userId: ctx.user.id,
        status: "verified",
        documentType: input.documentType,
        faceMatchScore: input.faceMatchScore ? String(input.faceMatchScore) : undefined,
        trustScore: input.trustScore,
        fraudDetectionResult: input.fraudDetectionResult,
        fraudConfidence: input.fraudConfidence ? String(input.fraudConfidence) : undefined,
        verificationCode,
        validityDays: input.validityDays,
        expiresAt,
        completedAt: new Date(),
      });

      // Get the created verification
      const verification = await getVerificationByCode(verificationCode);
      if (verification) {
        // Create verification lookup record for QR scanning
        await createVerificationLookup({
          verificationId: verification.id,
          userId: ctx.user.id,
          verificationCode,
          userName: ctx.user.name || "User",
          userEmail: ctx.user.email || undefined,
          userPhone: ctx.user.phoneNumber || undefined,
          status: "verified",
          trustScore: input.trustScore,
          documentType: input.documentType,
          faceMatchScore: input.faceMatchScore ? String(input.faceMatchScore) : undefined,
          fraudDetected: input.fraudDetectionResult === "fraud_detected",
          verifiedAt: new Date(),
          expiresAt,
        });

        // Create QR code
        const qrUrl = `${process.env.VITE_FRONTEND_URL || "http://localhost:5173"}/verify/lookup?code=${verificationCode}`;
        await createQrCode({
          verificationId: verification.id,
          userId: ctx.user.id,
          qrCodeData: qrUrl,
          verificationCode: verificationCode,
        });
      }

      return {
        id: verification?.id || 0,
        verificationCode,
        expiresAt,
      };
    }),

  /**
   * Get user's verification history (protected)
   */
  getUserVerifications: protectedProcedure.query(async ({ ctx }) => {
    return await getUserVerifications(ctx.user.id);
  }),

  /**
   * Get verification details (protected)
   */
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const verification = await getVerificationById(input.id);

      if (!verification) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Verification not found",
        });
      }

      // Check ownership
      if (verification.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to view this verification",
        });
      }

      return verification;
    }),

  /**
   * Public endpoint: Lookup verification by code (for QR scanning)
   * No authentication required
   */
  lookupByCode: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ input }) => {
      const lookup = await getVerificationLookupByCode(input.code);

      if (!lookup) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Verification not found",
        });
      }

      // Check if expired
      if (lookup.expiresAt && new Date() > lookup.expiresAt) {
        return {
          ...lookup,
          status: "expired",
        };
      }

      return lookup;
    }),

  /**
   * Generate PDF report for verification (protected)
   */
  generateReport: protectedProcedure
    .input(z.object({ verificationId: z.number() }))
    .query(async ({ ctx, input }) => {
      const verification = await getVerificationById(input.verificationId);

      if (!verification) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Verification not found",
        });
      }

      // Check ownership
      if (verification.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to access this report",
        });
      }

      // Return report data (PDF generation will be done on client or separate service)
      return {
        verificationId: verification.id,
        verificationCode: verification.verificationCode,
        userName: ctx.user.name,
        userEmail: ctx.user.email,
        userPhone: ctx.user.phoneNumber,
        documentType: verification.documentType,
        trustScore: verification.trustScore,
        faceMatchScore: verification.faceMatchScore,
        fraudDetectionResult: verification.fraudDetectionResult,
        status: verification.status,
        verifiedAt: verification.completedAt,
        expiresAt: verification.expiresAt,
        validityDays: verification.validityDays,
        generatedAt: new Date(),
      };
    }),
});
