import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/db";

if (!process.env.AUTH_SECRET) {
  throw new Error("AUTH_SECRET environment variable is required");
}

// Helper function to normalize base URL
function normalizeBaseURL(url: string | undefined): string {
  if (!url) {
    return "http://localhost:3000";
  }
  
  // If URL doesn't start with http:// or https://, add https://
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    // For production, default to https
    const protocol = process.env.NODE_ENV === "production" ? "https://" : "http://";
    return `${protocol}${url}`;
  }
  
  return url;
}

const baseURL = normalizeBaseURL(
  process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL
);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
      },
    },
  },
  socialProviders: {
    // Google auth removed
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  baseURL,
  secret: process.env.AUTH_SECRET,
  trustedOrigins: baseURL !== "http://localhost:3000" ? [baseURL] : undefined,
  // Cookie configuration for production
  advanced: {
    cookiePrefix: "better-auth",
    generateId: undefined,
    crossSubDomainCookies: {
      enabled: false,
    },
  },
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
