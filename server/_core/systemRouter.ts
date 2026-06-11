import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";

export const systemRouter = router({
  health: publicProcedure
    .input(z.object({ timestamp: z.number() }))
    .query(() => ({ ok: true })),

  register: publicProcedure
    .input(z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database connection not available");
      }

      // Create a real user in the database
      const result = await db.insert(users).values({
        openId: `user-${Date.now()}`,
        name: input.name,
        email: input.email,
        password: input.password,
        loginMethod: "email",
        role: "user",
      });
      
      // Note: result is the insert result
      return { success: true, message: "User registered successfully" };
    }),
});
