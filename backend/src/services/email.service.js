const nodemailer = require('nodemailer');

/**
 * Creates and returns a Nodemailer transporter based on .env SMTP configuration.
 */
function getTransporter() {
  const host = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = (process.env.SMTP_USER || process.env.EMAIL_USER || '').trim();
  const pass = (process.env.SMTP_PASS || process.env.EMAIL_PASS || '').trim().replace(/\s+/g, '');

  // If service like 'gmail' is specified
  if (process.env.SMTP_SERVICE) {
    return nodemailer.createTransport({
      service: process.env.SMTP_SERVICE.trim(),
      auth: user && pass ? { user, pass } : undefined,
    });
  }

  // Standard SMTP Transport
  return nodemailer.createTransport({
    host: host,
    port: port,
    secure: secure,
    auth: user && pass ? { user, pass } : undefined,
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/**
 * Sends an email with the official VEVO Entitlement Check PDF attached using Nodemailer.
 * @param {Object} client - The client/applicant record.
 * @param {Buffer} pdfBuffer - The generated PDF buffer.
 * @param {String} actionType - 'created' | 'updated'
 * @returns {Promise<Object>} - Status object.
 */
async function sendVisaPdfEmail(client, pdfBuffer, actionType = 'created') {
  const recipientEmail = process.env.NOTIFICATION_EMAIL || 'abhinavsharmaop66@gmail.com';
  const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || '"Australian Government - Department of Home Affairs" <no-reply@homeaffairs.gov.au>';
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

  try {
    const transporter = getTransporter();

    const mailOptions = {
      from: fromEmail,
      to: recipientEmail,
      subject: `Official VEVO Record [${actionType.toUpperCase()}] - ${client.FullName} (${client.PassportNumber})`,
      html: `
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
            A change or lodgement in the visa record for <strong>${client.FullName}</strong> has occurred. The latest official VEVO Entitlement Check certificate has been re-generated and attached.
          </p>

          <table style="width: 100%; border-collapse: collapse; margin: 18px 0; font-size: 13px; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:6px; overflow:hidden;">
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 9px 12px; font-weight: bold; color: #002B49; width: 38%;">Applicant Full Name:</td>
              <td style="padding: 9px 12px; font-weight: 600;">${client.FullName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 9px 12px; font-weight: bold; color: #002B49;">Passport / Document No:</td>
              <td style="padding: 9px 12px; font-family: monospace; font-weight: bold; color:#0F172A;">${client.PassportNumber}</td>
            </tr>
            <tr style="border-bottom: 1px solid #E2E8F0;">
              <td style="padding: 9px 12px; font-weight: bold; color: #002B49;">Visa Category / Stream:</td>
              <td style="padding: 9px 12px;">${client.Category}</td>
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
              <td style="padding: 9px 12px;">${client.CountryofCitizenship}</td>
            </tr>
          </table>

          <div style="background-color: #EFF6FF; border-left: 4px solid #3B82F6; padding: 10px 14px; margin: 18px 0; border-radius: 2px;">
            <p style="margin: 0; font-size: 12.5px; color: #1E40AF;">
              <strong>Attachment:</strong> The official <code>${filename}</code> without external links is attached for your verification.
            </p>
          </div>

          <div style="margin-top: 24px; padding-top: 14px; border-top: 1px solid #E2E8F0; font-size: 11.5px; color: #64748B;">
            <p style="margin: 0;">Official Electronic Record — Department of Home Affairs, Commonwealth of Australia.</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: filename,
          content: pdfBuffer,
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Nodemailer Success]: Email sent for ${client.PassportNumber} (${actionType}) to ${recipientEmail}. MessageId:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('[Nodemailer Error]: Failed to send visa email via SMTP:', err.message);
    return { success: false, error: err.message };
  }
}

module.exports = {
  sendVisaPdfEmail,
};
