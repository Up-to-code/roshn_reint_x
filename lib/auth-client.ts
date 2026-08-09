"use client";

import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import posthog from "posthog-js";

import type { auth } from "@/lib/auth";

// Get baseURL with fallback for client-side
const getBaseURL = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
};

const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const { signIn, signUp, useSession } = authClient;

export const signOut = ({ callbackUrl = "/" }: { callbackUrl?: string } = {}) => {
  posthog.reset();
  return authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        window.location.href = callbackUrl;
      },
    },
  });
};
