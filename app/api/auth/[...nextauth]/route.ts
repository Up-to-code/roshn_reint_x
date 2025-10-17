// FILE: app/api/auth/[...nextauth]/route.ts

// 👇 مهم جدًا يكون أول سطر في الملف
export const runtime = "nodejs";

import NextAuth from "next-auth";
import authConfig from "@/auth.config";

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
