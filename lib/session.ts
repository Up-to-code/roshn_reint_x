import "server-only";

import { cache } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const getSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  return session;
});

export const getCurrentUser = cache(async () => {
  const session = await getSession();
  return session?.user ?? null;
});
