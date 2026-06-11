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
  // ADMIN BYPASS
  const adminUser: User = {
    id: 1,
    openId: "admin-master",
    name: "Master Admin",
    email: "admin@example.com",
    phoneNumber: "0000000000",
    role: "admin",
  } as any;

  return {
    req: opts.req,
    res: opts.res,
    user: adminUser,
  };
}
