import "server-only";

import { cache } from "react";
import { auth as nextAuth } from "@/auth";

export const auth = cache(async () => {
  return await nextAuth();
});

export const getCurrentUser = cache(async () => {
  const session = await auth();
  if (!session?.user) {
    return undefined;
  }
  return session.user;
});
