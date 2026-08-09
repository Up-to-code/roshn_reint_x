"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { useSession } from "@/lib/auth-client";

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (!projectToken && process.env.NODE_ENV !== "production") {
  throw new Error(
    'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured',
  );
}

if (!host && process.env.NODE_ENV !== "production") {
  throw new Error(
    'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured',
  );
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    if (!projectToken || !host || posthog.__loaded) return;

    posthog.init(projectToken, {
      api_host: host,
      capture_exceptions: true,
      debug: process.env.NODE_ENV === "development",
      tracing_headers:
        typeof window === 'undefined' ? [] : [window.location.hostname],
    });
  }, []);

  useEffect(() => {
    const user = session?.user;

    if (!projectToken || !host || !posthog.__loaded || !user?.id) return;

    posthog.identify(user.id, {
      email: user.email,
      name: user.name,
      role: user.role,
    });
  }, [session]);

  return children;
}
