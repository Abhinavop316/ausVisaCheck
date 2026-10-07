const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

/**
 * Generates an official VEVO Entitlement Check PDF matching the official document layout.
 * @param {Object} client - The client/applicant record.
 * @returns {Promise<Buffer>} - Resolves with the PDF Buffer.
 */
function generateVevoPdfBuffer(client) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 40,
        info: {
          Title: 'Visa Entitlement Verification Online (VEVO) - Entitlement Check',
          Author: 'Australian Government - Department of Home Affairs',
          Subject: 'Official VEVO Entitlement Check Result',
        }
      });

      const buffers = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      // 1. Header with Official Australian Government Logo
      const possibleLogoPaths = [
        path.join(__dirname, '../../assets/logo-dark.png'),
        path.join(__dirname, '../../../frontend/public/logo-dark.png'),
        path.join(__dirname, '../../../frontend/public/logo.png'),
      ];

      let logoFound = null;
      for (const p of possibleLogoPaths) {
        if (fs.existsSync(p)) {
          logoFound = p;
          break;
        }
      }

      if (logoFound) {
        const logoWidth = 170;
        const logoX = (doc.page.width - logoWidth) / 2;
        doc.image(logoFound, logoX, 35, { width: logoWidth });
        doc.y = 85;
      } else {
        doc.fontSize(12).font('Helvetica-Bold').text('Australian Government', { align: 'center', underline: true });
        doc.moveDown(0.2);
        doc.fontSize(10.5).font('Helvetica-Bold').text('Department of Home Affairs', { align: 'center' });
        doc.moveDown(0.5);
      }

      // 2. Document Main Title
      doc.fontSize(13.5).font('Helvetica-Bold').text('Visa Entitlement Verification Online (VEVO)', { align: 'center' });
      doc.moveDown(0.1);
      doc.fontSize(11.5).font('Helvetica').text('Official Entitlement & Lodgement Verification Statement', { align: 'center' });
      doc.moveDown(0.6);

      // Compute timestamp
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      const timestamp = now.toLocaleDateString('en-AU', options) + ' (AEST) Canberra, Australia';

      // 3. Meaningful Verification Text (NO LINKS)
      doc.fontSize(8.5).font('Helvetica').text(
        `This document contains the official verification record of a Visa Entitlement Verification Online (VEVO) check and is valid as at ${timestamp}.`,
        { align: 'left', lineGap: 1.5 }
      );
      doc.moveDown(0.3);

      doc.fontSize(8.5).font('Helvetica-Bold').text(
        'Please note: VEVO Entitlement Checks reflect the current status registered in the Department of Home Affairs central repository.',
        { align: 'left', lineGap: 1.5 }
      );
      doc.moveDown(0.4);

      // Section: Official Visa Verification Statement
      doc.fontSize(9).font('Helvetica-Bold').text('Official Visa Verification Statement');
      doc.moveDown(0.1);
      doc.fontSize(8).font('Helvetica').text(
        'A VEVO check confirms the official processing status, travel authorities, and visa conditions associated with this applicant under Migration Regulations. All submitted documentation and travel identities have been recorded for official immigration compliance.',
        { lineGap: 1 }
      );
      doc.moveDown(0.4);

      // Section: Identity and Travel Document Verification
      doc.fontSize(9).font('Helvetica-Bold').text('Identity and Travel Document Verification');
      doc.moveDown(0.1);
      doc.fontSize(8).font('Helvetica-Bold').text('VEVO verification is linked directly to the registered travel document. ', { continued: true });
      doc.font('Helvetica').text('The passport or official travel identity document presented must match the particulars listed below for all border clearance and verification purposes.');
      doc.moveDown(0.4);

      // Section: Visa Compliance and Authority
      doc.fontSize(9).font('Helvetica-Bold').text('Visa Status and Compliance Directives');
      doc.moveDown(0.1);
      doc.fontSize(8).font('Helvetica').text('The visa holder must comply with all statutory conditions and validity terms applicable to their designated visa stream. Any change in personal particulars, travel document details, or residency must be notified immediately.');
      doc.moveDown(0.5);

      // 4. Horizontal Line Divider
      const startX = 40;
      const endX = doc.page.width - 40;
      doc.moveTo(startX, doc.y).lineTo(endX, doc.y).lineWidth(1).stroke('#000000');
      doc.moveDown(0.6);

      // 5. Entitlement Check Result Header
      doc.fontSize(10.5).font('Helvetica-Bold').text('Entitlement Check Result & Submitted Documents', { align: 'center' });
      doc.moveDown(0.1);
      doc.fontSize(7.5).font('Helvetica').text(`Valid as at ${timestamp}`, { align: 'center' });
      doc.moveDown(0.6);

      // Extract Name Parts (Leave Family name blank if not provided)
      let familyName = '';
      let givenNames = '';

      if (client.FamilyName !== undefined || client.GivenNames !== undefined) {
        familyName = (client.FamilyName || '').trim().toUpperCase();
        givenNames = (client.GivenNames || client.FullName || '').trim().toUpperCase();
      } else if (client.FullName) {
        if (client.FullName.includes(',')) {
          const parts = client.FullName.split(',');
          familyName = parts[0].trim().toUpperCase();
          givenNames = parts.slice(1).join(' ').trim().toUpperCase();
        } else {
          const parts = client.FullName.trim().split(' ');
          if (parts.length > 1) {
            familyName = parts[parts.length - 1].toUpperCase();
            givenNames = parts.slice(0, parts.length - 1).join(' ').toUpperCase();
          } else {
            familyName = '';
            givenNames = client.FullName.trim().toUpperCase();
          }
        }
      }

      const isStudent = (client.Category || '').toLowerCase().includes('student');
      const isWork = (client.Category || '').toLowerCase().includes('work');
      
      const visaDesc = isStudent ? 'STUDENT (SUBCLASS 600)' : isWork ? 'TEMPORARY SKILL SHORTAGE (SUBCLASS 482)' : 'TOURIST VISA (SUBCLASS 500)';
      const visaClassSubclass = isStudent ? 'TU / 600' : isWork ? 'TSS / 482' : 'FA / 500';
      const passportNum = client.PassportNumber || 'J5771300';
      const visaStatus = client.Status === 'Issued' ? 'Issued (In Effect / Active)' : (client.Status || 'Pending (Under Review)');
      const statusExplanation = client.Paragraph || 'Currently the status is pending, the application is under review.';
      const grantDate = '10 February 2026';
      const expiryDate = '10 February 2027';

      const submittedDocs = Array.isArray(client.Documents) && client.Documents.length > 0 
        ? client.Documents.join(', ')
        : 'Passport, Photo, Aadhar';

      // 6. Two-Column Table Rows
      const details = [
        ['Family name', familyName],
        ['Given name(s)', givenNames],
        ['Visa description', visaDesc],
        ['Passport / Travel document number', passportNum],
        ['Visa class / subclass', visaClassSubclass],
        ['Current Visa Status', visaStatus],
        ['Status Explanation / Remarks', statusExplanation],
        ['Submitted Documents', submittedDocs],
        ['Visa applicant', 'Primary'],
        ['Visa grant date', grantDate],
        ['Visa expiry date', expiryDate],
        ['Location', 'Offshore'],
        ['Entries allowed', 'Multiple entries to and from Australia during the validity of your visa'],
        ['Must not arrive after', expiryDate],
        ['Period of stay', 'Until ' + expiryDate],
      ];

      const col1X = 50;
      const col2X = 220;
      const rowHeight = 14;

      details.forEach(([label, value]) => {
        const currentY = doc.y;
        doc.fontSize(8).font('Helvetica-Bold').text(label, col1X, currentY, { width: 160 });
        doc.fontSize(8).font('Helvetica').text(value || '', col2X, currentY, { width: 330 });
        const cellText = value && value.trim() ? value : ' ';
        doc.y = currentY + Math.max(rowHeight, doc.heightOfString(cellText, { width: 330 }) + 3);
      });

      doc.moveDown(1);

      // 7. Footer Meta (NO LINKS)
      const footerY = doc.page.height - 40;
      doc.moveTo(startX, footerY).lineTo(endX, footerY).lineWidth(0.5).stroke('#888888');

      doc.fontSize(7).font('Helvetica').text(
        `Official Electronic Record — Department of Home Affairs, Commonwealth of Australia\nValid as at: ${timestamp}`,
        startX,
        footerY + 5,
        { width: 420, lineGap: 1 }
      );

      doc.fontSize(7).font('Helvetica-Bold').text(
        'Page 1 of 1',
        endX - 60,
        footerY + 5,
        { width: 60, align: 'right' }
      );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  generateVevoPdfBuffer,
};
