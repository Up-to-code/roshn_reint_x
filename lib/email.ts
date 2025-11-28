import { Resend } from "resend";

// Resend client for sending transactional emails
export const resend = new Resend(process.env.RESEND_API_KEY);

