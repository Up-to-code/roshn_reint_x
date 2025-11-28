"use client";

/**
 * Better Auth doesn't require a SessionProvider like NextAuth.
 * Session state is managed internally via the authClient and useSession hook.
 * This component exists to maintain compatibility with the existing layout structure.
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
