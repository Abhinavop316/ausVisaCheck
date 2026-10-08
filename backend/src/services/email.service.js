const { Resend } = require('resend');
const nodemailer = require('nodemailer');

/**
 * Sends an email with the official VEVO Entitlement Check PDF attached.
 * Supports both Nodemailer (Gmail SMTP configured in .env) and Resend API.
 * Uses RECIEVER_EMAIL / RECIEVER_EMIAL / RECEIVER_EMAIL from .env.
 * 
 * @param {Object} client - The client/applicant record.
 * @param {Buffer} pdfBuffer - The generated PDF buffer.
 * @param {String} actionType - 'created' | 'updated'
 * @returns {Promise<Object>} - Status object.
 */
async function sendVisaPdfEmail(client, pdfBuffer, actionType = 'created') {
  const recipientEmail = (
    process.env.RECIEVER_EMAIL || 
    process.env.RECIEVER_EMIAL || 
    process.env.RECEIVER_EMAIL || 
    'abhinavsho220@gmail.com'
  ).trim();

  const filename = `VEVO_Entitlement_Check_${client.PassportNumber || 'Document'}.pdf`;

  const actionTitle = actionType === 'updated' 
    ? 'Visa Record Updated — VEVO Notification' 
    : 'New Visa Application Lodged — VEVO Notification';

  const actionBadge = actionType === 'updated' 
    ? '<span style="display:inline-block; padding:3px 8px; background:#FEF3C7; color:#92400E; border-radius:4px; font-weight:bold; font-size:12px;">UPDATED RECORD</span>' 
    : '<span style="display:inline-block; padding:3px 8px; background:#D1FAE5; color:#065F46; border-radius:4px; font-weight:bold; font-size:12px;">NEW LODGEMENT</span>';

  const submittedDocsList = Array.isArray(client.Documents) && client.Documents.length > 0
    ? client.Documents.join(', ')
    : 'Passport, Photo, Aadhar';

  const subject = `Official VEVO Record [${actionType.toUpperCase()}] - ${client.FullName} (${client.PassportNumber || 'N/A'})`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #1E293B; line-height: 1.6; max-width: 620px; margin: 0 auto; border: 1px solid #CBD5E1; padding: 24px; border-radius: 8px; background:#FFFFFF;">
      <div style="background-color: #002B49; color: #FFFFFF; padding: 16px 20px; border-radius: 6px; margin-bottom: 20px;">
        <h2 style="margin: 0; font-size: 18px; letter-spacing: 0.3px;">Australian Government — Department of Home Affairs</h2>
        <p style="margin: 4px 0 0; font-size: 13px; color: #93C5FD;">Visa Entitlement Verification Online (VEVO) Notification</p>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px;">
        <h3 style="margin:0; font-size:16px; color:#0F172A;">${actionTitle}</h3>
        ${actionBadge}
      </div>

      <p style="font-size:14px; margin-bottom:14px;">
        A change or lodgement in the visa record for <strong>${client.FullName}</strong> has occurred. The latest official VEVO Entitlement Check certificate has been generated and attached with the new details.
      </p>

      <table style="width: 100%; border-collapse: collapse; margin: 18px 0; font-size: 13px; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:6px; overflow:hidden;">
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 9px 12px; font-weight: bold; color: #002B49; width: 38%;">Applicant Full Name:</td>
          <td style="padding: 9px 12px; font-weight: 600;">${client.FullName}</td>
        </tr>
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 9px 12px; font-weight: bold; color: #002B49;">Passport / Document No:</td>
          <td style="padding: 9px 12px; font-family: monospace; font-weight: bold; color:#0F172A;">${client.PassportNumber || ''}</td>
        </tr>
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 9px 12px; font-weight: bold; color: #002B49;">Visa Category / Stream:</td>
          <td style="padding: 9px 12px;">${client.Category || ''}</td>
        </tr>
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 9px 12px; font-weight: bold; color: #002B49;">Current Status:</td>
          <td style="padding: 9px 12px; font-weight: bold; color: ${client.Status === 'Issued' ? '#15803d' : '#0284c7'};">
            ${client.Status || 'Pending'}
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 9px 12px; font-weight: bold; color: #002B49;">Status Explanation:</td>
          <td style="padding: 9px 12px; color: #334155;">${client.Paragraph || 'Currently the status is pending, the application is under review.'}</td>
        </tr>
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 9px 12px; font-weight: bold; color: #002B49;">Submitted Documents:</td>
          <td style="padding: 9px 12px; color: #0F172A; font-weight: 600;">${submittedDocsList}</td>
        </tr>
        <tr>
          <td style="padding: 9px 12px; font-weight: bold; color: #002B49;">Country of Citizenship:</td>
          <td style="padding: 9px 12px;">${client.CountryofCitizenship || ''}</td>
        </tr>
      </table>

      <div style="background-color: #EFF6FF; border-left: 4px solid #3B82F6; padding: 10px 14px; margin: 18px 0; border-radius: 2px;">
        <p style="margin: 0; font-size: 12.5px; color: #1E40AF;">
          <strong>Attachment:</strong> The official updated <code>${filename}</code> is attached for your verification.
        </p>
      </div>

      <div style="margin-top: 24px; padding-top: 14px; border-top: 1px solid #E2E8F0; font-size: 11.5px; color: #64748B;">
        <p style="margin: 0;">Official Electronic Record — Department of Home Affairs, Commonwealth of Australia.</p>
      </div>
    </div>
  `;

  // 1. Try Nodemailer first if SMTP is configured (direct Gmail delivery without domain restrictions)
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: `"Australian Government - Department of Home Affairs" <${process.env.SMTP_USER}>`,
        to: recipientEmail,
        subject: subject,
        html: htmlContent,
        attachments: [
          {
            filename: filename,
            content: pdfBuffer,
          },
        ],
      });

      console.log(`[Nodemailer Success]: Visa PDF email (${actionType}) sent for ${client.PassportNumber} to ${recipientEmail}. MessageId:`, info.messageId);
      return { success: true, messageId: info.messageId, provider: 'nodemailer' };
    } catch (smtpErr) {
      console.warn('[Nodemailer Warning]: SMTP delivery failed, falling back to Resend API:', smtpErr.message);
    }
  }

  // 2. Fallback to Resend API
  const resendApiKey = (process.env.RESEND_API || '').trim();
  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      const fromEmail = (process.env.RESEND_FROM || 'Australian Government <onboarding@resend.dev>').trim();

      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: recipientEmail,
        subject: subject,
        html: htmlContent,
        attachments: [
          {
            filename: filename,
            content: pdfBuffer,
          },
        ],
      });

      if (error) {
        console.error('[Resend API Error]:', error.message || error);
        return { success: false, error: error.message || error };
      }

      console.log(`[Resend Success]: Email sent for ${client.PassportNumber} (${actionType}) to ${recipientEmail}. EmailId:`, data?.id);
      return { success: true, messageId: data?.id, provider: 'resend' };
    } catch (resendErr) {
      console.error('[Resend Error]: Failed to send visa email via Resend:', resendErr.message);
      return { success: false, error: resendErr.message };
    }
  }

  return { success: false, error: 'No email transport configured in .env' };
}

module.exports = {
  sendVisaPdfEmail,
};
