import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateVevoPdf = async (elementId, filename = 'VEVO_Entitlement_Check.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found for PDF generation:', elementId);
    window.print();
    return;
  }

  try {
    // Temporarily ensure the element is visible and styled for high-res rendering
    const canvas = await html2canvas(element, {
      scale: 2.5, // High resolution
      useCORS: true,
      logging: false,
      backgroundColor: '#FFFFFF',
      windowWidth: 794, // Standard A4 width in px at 96 DPI
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } catch (err) {
    console.error('Error generating PDF with html2canvas:', err);
    // Fallback to print
    window.print();
  }
};
