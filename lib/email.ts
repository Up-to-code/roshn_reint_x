import { Resend } from "resend";
import { MailtrapClient } from "mailtrap";

// Resend client for sending transactional emails
export const resend = new Resend(process.env.RESEND_API_KEY);

// Mailtrap client for notifications
const token = process.env.MAILTRAP_TOKEN || "";
export const mailtrap = new MailtrapClient({ token });

