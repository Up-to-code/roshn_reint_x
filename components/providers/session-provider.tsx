"use client";

import { authClient } from "@/lib/auth-client";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <authClient.SessionProvider>{children}</authClient.SessionProvider>;
}
