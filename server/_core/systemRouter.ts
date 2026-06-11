import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import  db  from "../db";
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
      // Create a real user in the database
      const [result] = await db.insert(users).values({
        openId: `user-${Date.now()}`,
        name: input.name,
        email: input.email,
        loginMethod: "email",
        role: "user",
      });
      
      // Note: result.insertId is for MySQL
      const id = (result as any).insertId;
      
      return { success: true, id };
    }),
});
