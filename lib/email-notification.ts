import nodemailer from "nodemailer";
import type { Lead } from "@/types/lead";

function isEmailNotificationConfigured() {
  return Boolean(
    process.env.EMAIL_NOTIFICATION_TO &&
      process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS,
  );
}

export async function sendLeadNotification(lead: Lead) {
  if (!isEmailNotificationConfigured()) {
    return;
  }

  try {
    const smtpPort = Number(process.env.SMTP_PORT);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: smtpPort,
      secure: process.env.SMTP_SECURE === "true" || smtpPort === 465,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.EMAIL_NOTIFICATION_TO,
      subject: `New ${lead.priority} lead - ${lead.course || lead.fullName}`,
      text: [
        `New lead from ${lead.fullName}`,
        "",
        `Phone number: ${lead.phoneNumber}`,
        `Course: ${lead.course}`,
        `City: ${lead.city}`,
        `Priority: ${lead.priority}`,
        `Status: ${lead.status}`,
        `Notes: ${lead.notes}`,
        `Original message: ${lead.originalMessage}`,
        `Date/time: ${lead.createdAt}`,
      ].join("\n"),
    });
  } catch (error) {
    console.error("[email] Lead notification failed.", error);
  }
}
