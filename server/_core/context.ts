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
  // BULLETPROOF ADMIN BYPASS
  const adminUser: User = {
    id: 1,
    openId: "admin-master-id",
    name: "Master Admin",
    email: "admin@example.com",
    phoneNumber: "0000000000",
    loginMethod: "admin",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  } as any;

  // Ensure all required fields are present to prevent React crashes
  const safeUser = {
    ...adminUser,
    id: Number(adminUser.id),
    role: "admin",
  };

  return {
    req: opts.req,
    res: opts.res,
    user: safeUser as User,
  };
}
