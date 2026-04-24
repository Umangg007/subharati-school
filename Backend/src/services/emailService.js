const nodemailer = require("nodemailer");
const { env } = require("../config/env");

let transporter;

const getTransporter = () => {
  if (transporter) return transporter;
  if (!env.smtpHost) return null;

  transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: env.smtpUser ? { user: env.smtpUser, pass: env.smtpPass } : undefined
  });

  return transporter;
};

/**
 * Send a notification email to all configured admin addresses.
 * @param {{ subject: string, text: string, html?: string }} options
 */
const sendEmail = async ({ subject, text, html }) => {
  const tx = getTransporter();
  if (!tx) {
    console.log("[Email] Skipped: SMTP not configured");
    return;
  }

  // Send to all admin recipients; fall back to smtpFrom if none configured
  const recipients = env.adminEmails.length > 0
    ? env.adminEmails.join(",")
    : env.smtpFrom;

  await tx.sendMail({
    from: env.smtpFrom,
    to: recipients,
    subject,
    text,
    html: html || undefined
  });

  console.log(`[Email] Sent "${subject}" to ${recipients}`);
};

module.exports = { sendEmail };
