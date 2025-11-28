import type { NextAuthOptions } from "next-auth";

// This config is used in middleware (Edge runtime)
// IMPORTANT: Only include Edge-compatible configuration here
// Providers with database calls or Node.js dependencies (like Google, Credentials with bcrypt)
// should be added in auth.ts instead
const authConfig: Partial<NextAuthOptions> = {
  providers: [],
  pages: {
    signIn: "/login",
  },
};

export default authConfig;
