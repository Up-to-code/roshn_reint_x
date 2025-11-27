// auth.ts - Updated version
import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { getUserById } from "@/lib/user";
import { LoginSchema } from "@/schemas"; // Make sure this exists

declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole;
    } & DefaultSession["user"];
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
          });

          if (!user || !user.password) return null;

          // Verify password
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
              role: user.role,
            };
          }
        }

        return null;
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, credentials }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      // For credentials login, just check if user exists
      const existingUser = await getUserById(user.id!);
      return !!existingUser;
    },

    async session({ token, session }) {
      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub;
        }

        if (token.email) {
          session.user.email = token.email;
        }

        if (token.role) {
          session.user.role = token.role as UserRole;
        }

        session.user.name = token.name;
        session.user.image = token.picture;
      }

      return session;
    },

    async jwt({ token, user, trigger, session }) {
      // Handle initial sign in
      if (user) {
        token.role = (user as any).role;
      }

      // Handle session update
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }

      if (!token.sub) return token;

      const dbUser = await getUserById(token.sub);

      if (!dbUser) return token;

      token.name = dbUser.name;
      token.email = dbUser.email;
      token.picture = dbUser.image;
      token.role = dbUser.role;

      return token;
    },
  },
} satisfies NextAuthConfig);