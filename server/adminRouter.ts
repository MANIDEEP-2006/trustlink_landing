import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "./db";
import { verifications, users } from "../drizzle/schema";
import { eq, desc, sql, or, like } from "drizzle-orm";

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
   * Get all verifications with filtering, search, and pagination (admin only)
   */
  getVerifications: adminProcedure
    .input(
      z.object({
        limit: z.number().default(10),
        offset: z.number().default(0),
        search: z.string().optional(),
        status: z.enum(["verified", "rejected", "expired", "pending"]).optional(),
        userId: z.number().optional(),
        sortBy: z.enum(["date", "trustScore", "status"]).default("date"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let query = db.select().from(verifications) as any;
      let countQuery = db
        .select({ count: sql<number>`count(*)` })
        .from(verifications) as any;

      // Apply filters
      const conditions = [];

      if (input.userId) {
        conditions.push(eq(verifications.userId, input.userId));
      }

      if (input.status) {
        conditions.push(eq(verifications.status, input.status as any));
      }

      if (input.search) {
        // Search in verification code or document type
        conditions.push(
          or(
            like(verifications.verificationId, `%${input.search}%`),
            like(verifications.documentType, `%${input.search}%`)
          )
        );
      }

      if (conditions.length > 0) {
        query = query.where(or(...conditions));
        countQuery = countQuery.where(or(...conditions));
      }

      // Apply sorting
      if (input.sortBy === "trustScore") {
        query = query.orderBy(
          input.sortOrder === "desc"
            ? desc(verifications.trustScore)
            : verifications.trustScore
        );
      } else if (input.sortBy === "status") {
        query = query.orderBy(
          input.sortOrder === "desc"
            ? desc(verifications.status)
            : verifications.status
        );
      } else {
        query = query.orderBy(
          input.sortOrder === "desc"
            ? desc(verifications.completedAt)
            : verifications.completedAt
        );
      }

      query = query.limit(input.limit).offset(input.offset);

      const data = await query;
      const countResult = await countQuery;
      const total = countResult[0]?.count || 0;

      return {
        data,
        total,
        page: Math.floor(input.offset / input.limit) + 1,
        pageSize: input.limit,
        hasMore: input.offset + input.limit < total,
      };
    }),

  /**
   * Get all users with search and pagination (admin only)
   */
  getUsers: adminProcedure
    .input(
      z.object({
        limit: z.number().default(10),
        offset: z.number().default(0),
        search: z.string().optional(),
        role: z.enum(["admin", "user"]).optional(),
        sortBy: z.enum(["date", "name", "email"]).default("date"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let query = db.select().from(users) as any;
      let countQuery = db
        .select({ count: sql<number>`count(*)` })
        .from(users) as any;

      // Apply filters
      const conditions = [];

      if (input.role) {
        conditions.push(eq(users.role, input.role as any));
      }

      if (input.search) {
        // Search in name, email, or phone
        conditions.push(
          or(
            like(users.name, `%${input.search}%`),
            like(users.email, `%${input.search}%`),
            like(users.phoneNumber, `%${input.search}%`)
          )
        );
      }

      if (conditions.length > 0) {
        query = query.where(or(...conditions));
        countQuery = countQuery.where(or(...conditions));
      }

      // Apply sorting
      if (input.sortBy === "name") {
        query = query.orderBy(
          input.sortOrder === "desc" ? desc(users.name) : users.name
        );
      } else if (input.sortBy === "email") {
        query = query.orderBy(
          input.sortOrder === "desc" ? desc(users.email) : users.email
        );
      } else {
        query = query.orderBy(
          input.sortOrder === "desc" ? desc(users.createdAt) : users.createdAt
        );
      }

      query = query.limit(input.limit).offset(input.offset);

      const data = await query;
      const countResult = await countQuery;
      const total = countResult[0]?.count || 0;

      return {
        data,
        total,
        page: Math.floor(input.offset / input.limit) + 1,
        pageSize: input.limit,
        hasMore: input.offset + input.limit < total,
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
   * Export verifications as CSV (admin only)
   */
  exportVerifications: adminProcedure
    .input(
      z.object({
        status: z.enum(["verified", "rejected", "expired", "pending"]).optional(),
        limit: z.number().default(1000),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let query = db.select().from(verifications) as any;

      if (input.status) {
        query = query.where(eq(verifications.status, input.status as any));
      }

      query = query.limit(input.limit);
      const data = await query;

      // Convert to CSV format
      if (data.length === 0) {
        return { csv: "", count: 0 };
      }

      const headers = Object.keys(data[0]);
      const csvRows = [
        headers.join(","),
        ...data.map((row: any) =>
          headers
            .map((header) => {
              const value = row[header];
              if (value === null || value === undefined) return "";
              if (typeof value === "string" && value.includes(",")) {
                return `"${value}"`;
              }
              return value;
            })
            .join(",")
        ),
      ];

      return {
        csv: csvRows.join("\n"),
        count: data.length,
        timestamp: new Date().toISOString(),
      };
    }),
});
