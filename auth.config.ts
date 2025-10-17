import Google from "next-auth/providers/google";
import Email from "next-auth/providers/email";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Email({
      async sendVerificationRequest({ identifier, url }) {
        await resend.emails.send({
          from: "Next App <onboarding@resend.dev>",
          to: identifier,
          subject: "Sign in to Next App",
          html: `<p>Click <a href="${url}">here</a> to sign in.</p>`,
        });
      },
    }),
  ],
};

export default authConfig;
