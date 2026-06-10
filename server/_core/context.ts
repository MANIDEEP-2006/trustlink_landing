import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  // ULTIMATE ADMIN BYPASS: This makes everyone an admin automatically
  const adminUser: User = {
    id: 1,
    openId: "admin-user",
    name: "Master Admin",
    email: "admin@example.com",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  } as any;

  return {
    req: opts.req,
    res: opts.res,
    user: adminUser,
  };
}
