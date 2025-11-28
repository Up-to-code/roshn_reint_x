// FILE: app/api/auth/[...nextauth]/route.ts

// 👇 مهم جدًا يكون أول سطر في الملف
export const runtime = "nodejs";

import NextAuth from "@/auth";

export { NextAuth as GET, NextAuth as POST };
