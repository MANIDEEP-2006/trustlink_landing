import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { COOKIE_NAME } from "@shared/const";
import * as jose from "jose";
import { ENV } from "./env";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  // Extract user from session cookie
  let user: User | null = null;
  
  try {
    const cookies = opts.req.headers.cookie || "";
    const cookieMatch = cookies.split(";").find(c => c.trim().startsWith(COOKIE_NAME));
    
    if (cookieMatch) {
      const token = cookieMatch.split("=")[1];
      if (token && ENV.cookieSecret) {
        // Verify JWT token
        const secret = new TextEncoder().encode(ENV.cookieSecret);
        const verified = await jose.jwtVerify(token, secret);
        
        if (verified.payload && typeof verified.payload === "object") {
          user = {
            id: (verified.payload as any).userId || 1,
            openId: (verified.payload as any).openId || "",
            name: (verified.payload as any).name || "User",
            email: (verified.payload as any).email || "",
            phoneNumber: (verified.payload as any).phoneNumber || "",
            role: (verified.payload as any).role || "user",
          } as User;
        }
      }
    }
  } catch (error) {
    // No valid session cookie, user remains null
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
