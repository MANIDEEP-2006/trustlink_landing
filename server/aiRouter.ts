import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import {
  mockOCRExtraction,
  mockFaceMatching,
  mockFraudDetection,
  calculateTrustScore,
  generateVerificationSummary,
  determineVerificationStatus,
} from "./aiFeatures";
import { TRPCError } from "@trpc/server";

export const aiRouter = router({
  /**
   * Process document with OCR (protected)
   */
  processDocument: protectedProcedure
    .input(
      z.object({
        documentUrl: z.string().url(),
        documentType: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const ocrResult = mockOCRExtraction(input.documentUrl);

        if (!ocrResult.success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "OCR processing failed",
          });
        }

        return {
          success: true,
          data: ocrResult,
        };
      } catch (error) {
        console.error("Document processing error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to process document",
        });
      }
    }),

  /**
   * Match face between document and selfie (protected)
   */
  matchFace: protectedProcedure
    .input(
      z.object({
        documentUrl: z.string().url(),
        selfieUrl: z.string().url(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const faceResult = mockFaceMatching(input.documentUrl, input.selfieUrl);

        if (!faceResult.success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Face matching failed",
          });
        }

        return {
          success: true,
          data: faceResult,
        };
      } catch (error) {
        console.error("Face matching error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to match faces",
        });
      }
    }),

  /**
   * Detect fraud in verification (protected)
   */
  detectFraud: protectedProcedure
    .input(
      z.object({
        documentUrl: z.string().url(),
        selfieUrl: z.string().url(),
        ocrData: z.any().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const fraudResult = mockFraudDetection(
          input.documentUrl,
          input.selfieUrl,
          input.ocrData
        );

        if (!fraudResult.success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Fraud detection failed",
          });
        }

        return {
          success: true,
          data: fraudResult,
        };
      } catch (error) {
        console.error("Fraud detection error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to detect fraud",
        });
      }
    }),

  /**
   * Calculate comprehensive trust score (protected)
   */
  calculateScore: protectedProcedure
    .input(
      z.object({
        ocrScore: z.number().min(0).max(1),
        faceMatchScore: z.number().min(0).max(1),
        fraudScore: z.number().min(0).max(1),
        documentExpiry: z.boolean().optional(),
        livenessScore: z.number().min(0).max(1).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const trustScore = calculateTrustScore(
          input.ocrScore,
          input.faceMatchScore,
          input.fraudScore,
          {
            documentExpiry: input.documentExpiry,
            livenessScore: input.livenessScore,
          }
        );

        return {
          success: true,
          trustScore,
          riskLevel: trustScore >= 85 ? "low" : trustScore >= 70 ? "medium" : "high",
        };
      } catch (error) {
        console.error("Score calculation error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to calculate trust score",
        });
      }
    }),

  /**
   * Process complete verification (protected)
   */
  processVerification: protectedProcedure
    .input(
      z.object({
        documentUrl: z.string().url(),
        selfieUrl: z.string().url(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Run all AI features in parallel
        const [ocrData, faceData, fraudData] = await Promise.all([
          Promise.resolve(mockOCRExtraction(input.documentUrl)),
          Promise.resolve(mockFaceMatching(input.documentUrl, input.selfieUrl)),
          Promise.resolve(
            mockFraudDetection(input.documentUrl, input.selfieUrl, null)
          ),
        ]);

        // Calculate trust score
        const trustScore = calculateTrustScore(
          ocrData.ocrScore,
          faceData.matchScore,
          fraudData.fraudScore
        );

        // Determine status
        const status = determineVerificationStatus(
          trustScore,
          fraudData.isFraudulent,
          faceData.isMatch
        );

        // Generate summary
        const summary = generateVerificationSummary(
          ocrData,
          faceData,
          fraudData,
          trustScore
        );

        return {
          success: true,
          ocrData,
          faceData,
          fraudData,
          trustScore,
          status,
          summary,
        };
      } catch (error) {
        console.error("Verification processing error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to process verification",
        });
      }
    }),
});
