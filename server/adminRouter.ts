import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "./db";
import { verifications, users } from "../drizzle/schema";
import { eq, desc, sql } from "drizzle-orm";

/**
 * Admin-only procedure that checks user role
 */
const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have permission to access admin features",
    });
  }
  return next({ ctx });
});

export const adminRouter = router({
  /**
   * Get verification statistics (admin only)
   */
  getStats: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const totalVerifications = await db
      .select({ count: sql<number>`count(*)` })
      .from(verifications);

    const verifiedCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(verifications)
      .where(eq(verifications.status, "verified" as any));

    const rejectedCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(verifications)
      .where(eq(verifications.status, "rejected" as any));

    const expiredCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(verifications)
      .where(eq(verifications.status, "expired" as any));

    const pendingCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(verifications)
      .where(eq(verifications.status, "pending" as any));

    const totalUsers = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);

    return {
      totalVerifications: totalVerifications[0]?.count || 0,
      verifiedCount: verifiedCount[0]?.count || 0,
      rejectedCount: rejectedCount[0]?.count || 0,
      expiredCount: expiredCount[0]?.count || 0,
      pendingCount: pendingCount[0]?.count || 0,
      totalUsers: totalUsers[0]?.count || 0,
    };
  }),

  /**
   * Get all verifications with filtering and pagination (admin only)
   */
  getVerifications: adminProcedure
    .input(
      z.object({
        limit: z.number().default(10),
        offset: z.number().default(0),
        search: z.string().optional(),
        userId: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let query = db.select().from(verifications) as any;

      if (input.userId) {
        query = query.where(eq(verifications.userId, input.userId));
      }

      query = query.orderBy(desc(verifications.completedAt));
      query = query.limit(input.limit).offset(input.offset);

      const data = await query;
      
      // Get total count
      let countQuery = db
        .select({ count: sql<number>`count(*)` })
        .from(verifications) as any;

      if (input.userId) {
        countQuery = countQuery.where(eq(verifications.userId, input.userId));
      }

      const countResult = await countQuery;
      const total = countResult[0]?.count || 0;

      return {
        data,
        total,
        page: Math.floor(input.offset / input.limit) + 1,
        pageSize: input.limit,
      };
    }),

  /**
   * Get all users (admin only)
   */
  getUsers: adminProcedure
    .input(
      z.object({
        limit: z.number().default(10),
        offset: z.number().default(0),
        search: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let query = db.select().from(users) as any;

      query = query.orderBy(desc(users.createdAt));
      query = query.limit(input.limit).offset(input.offset);

      const data = await query;

      // Get total count
      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(users);

      const total = countResult[0]?.count || 0;

      return {
        data,
        total,
        page: Math.floor(input.offset / input.limit) + 1,
        pageSize: input.limit,
      };
    }),

  /**
   * Get verification details with user info (admin only)
   */
  getVerificationDetail: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const verification = await db
        .select()
        .from(verifications)
        .where(eq(verifications.id, input.id))
        .limit(1);

      if (!verification[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Verification not found",
        });
      }

      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, verification[0].userId))
        .limit(1);

      return {
        verification: verification[0],
        user: user[0] || null,
      };
    }),

  /**
   * Get user with all verifications (admin only)
   */
  getUserDetail: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, input.id))
        .limit(1);

      if (!user[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const userVerifications = await db
        .select()
        .from(verifications)
        .where(eq(verifications.userId, input.id))
        .orderBy(desc(verifications.completedAt));

      return {
        user: user[0],
        verifications: userVerifications,
      };
    }),

  /**
   * Get recent verifications (admin only)
   */
  getRecentVerifications: adminProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      return db
        .select()
        .from(verifications)
        .orderBy(desc(verifications.completedAt))
        .limit(input.limit);
    }),

  /**
   * Get high-risk verifications (fraud detected) (admin only)
   */
  getHighRiskVerifications: adminProcedure
    .input(z.object({ limit: z.number().default(20) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      return db
        .select()
        .from(verifications)
        .where(eq(verifications.fraudDetectionResult, "fraud_detected"))
        .orderBy(desc(verifications.completedAt))
        .limit(input.limit);
    }),

  /**
   * Export verifications as CSV data (admin only)
   */
  exportVerifications: adminProcedure
    .input(
      z.object({
        userId: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let query = db.select().from(verifications) as any;

      if (input.userId) {
        query = query.where(eq(verifications.userId, input.userId));
      }

      const verifs = await query;

      const csvData = verifs.map((v: any) => ({
        id: v.id,
        code: v.verificationCode,
        userId: v.userId,
        status: v.status,
        documentType: v.documentType,
        trustScore: v.trustScore,
        faceMatchScore: v.faceMatchScore,
        fraudDetected: v.fraudDetectionResult === "fraud_detected",
        verifiedAt: v.completedAt?.toISOString(),
        expiresAt: v.expiresAt?.toISOString(),
      }));

      return csvData;
    }),
});
