//lib/email.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNotificationEmail({
  to,
  subject,
  message,
}: {
  to: string;
  subject: string;
  message: string;
}) {
  return resend.emails.send({
    from: "Digital Tour <onboarding@resend.dev>",
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6">
        <h2>${subject}</h2>
        <p>${message}</p>
        <hr />
        <small>Digital Tour Notification</small>
      </div>
    `,
  });
}
