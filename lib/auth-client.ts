"use client";

import { createAuthClient } from "better-auth/react";

// Get baseURL with fallback for client-side
const getBaseURL = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});

export const { signIn, signOut, signUp, useSession } = authClient;
