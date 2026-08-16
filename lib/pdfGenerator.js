import { jsPDF } from 'jspdf';

/**
 * Generates and downloads a branded PDF Job Sheet for a given booking.
 * @param {Object} booking - The booking details object.
 * @param {boolean} autoDownload - If true, automatically triggers browser download.
 * @returns {jsPDF} The jsPDF document instance.
 */
export function generateJobSheetPDF(booking, autoDownload = true) {
  if (!booking) return null;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const primaryRed = [220, 38, 38]; // #DC2626
  const darkNavy = [15, 23, 42];    // #0F172A
  const slateGrey = [100, 116, 139]; // #64748B
  const lightBg = [248, 250, 252];  // #F8FAFC
  const borderGrey = [226, 232, 240]; // #E2E8F0
  const emeraldGreen = [16, 185, 129]; // #10B981

  let y = margin;

  // 1. Top Header Banner
  doc.setFillColor(primaryRed[0], primaryRed[1], primaryRed[2]);
  doc.roundedRect(margin, y, contentWidth, 24, 3, 3, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('CoolFix - Appliance Care & Repair', margin + 6, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Official Service Job Sheet & Tax Invoice Receipt', margin + 6, y + 17);

  // Job ID badge in Header
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(pageWidth - margin - 52, y + 4, 46, 16, 2, 2, 'F');
  doc.setTextColor(primaryRed[0], primaryRed[1], primaryRed[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('JOB ID / TRACKING', pageWidth - margin - 29, y + 9, { align: 'center' });
  doc.setFontSize(11);
  doc.text(booking.jobId || 'N/A', pageWidth - margin - 29, y + 16, { align: 'center' });

  y += 28;

  // 2. Status & Meta Bar
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'FD');

  const bookingDate = booking.createdAt
    ? (typeof booking.createdAt === 'string'
        ? new Date(booking.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        : booking.createdAt.toDate
          ? booking.createdAt.toDate().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
          : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }))
    : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(slateGrey[0], slateGrey[1], slateGrey[2]);
  doc.text('Date of Service:', margin + 4, y + 9);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.setFont('helvetica', 'bold');
  doc.text(bookingDate, margin + 29, y + 9);

  // Job Status Badge
  const statusStr = (booking.status || 'Pending').toUpperCase();
  const isCompleted = statusStr === 'COMPLETED';
  const badgeColor = isCompleted ? emeraldGreen : primaryRed;

  doc.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
  doc.roundedRect(pageWidth - margin - 42, y + 3, 38, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(isCompleted ? 'COMPLETED' : statusStr, pageWidth - margin - 23, y + 8.5, { align: 'center' });

  y += 18;

  // 3. Customer Information & Service Information (2 Columns Box)
  const colWidth = (contentWidth - 6) / 2;

  // Left Column - Customer Details
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.roundedRect(margin, y, colWidth, 48, 2, 2, 'FD');

  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, colWidth, 7, 'F');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('CUSTOMER INFORMATION', margin + 4, y + 5);

  doc.setFontSize(8.5);
  doc.setTextColor(slateGrey[0], slateGrey[1], slateGrey[2]);
  doc.setFont('helvetica', 'normal');
  doc.text('Name:', margin + 4, y + 13);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.setFont('helvetica', 'bold');
  doc.text(booking.name || 'N/A', margin + 22, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(slateGrey[0], slateGrey[1], slateGrey[2]);
  doc.text('Phone:', margin + 4, y + 20);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.setFont('helvetica', 'bold');
  doc.text(booking.phone || 'N/A', margin + 22, y + 20);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(slateGrey[0], slateGrey[1], slateGrey[2]);
  doc.text('Address:', margin + 4, y + 27);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.setFont('helvetica', 'normal');
  const splitAddress = doc.splitTextToSize(booking.address || 'N/A', colWidth - 26);
  doc.text(splitAddress, margin + 22, y + 27);

  // Right Column - Appliance & Service Details
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.roundedRect(margin + colWidth + 6, y, colWidth, 48, 2, 2, 'FD');

  doc.setFillColor(241, 245, 249);
  doc.rect(margin + colWidth + 6, y, colWidth, 7, 'F');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('SERVICE SPECIFICATION', margin + colWidth + 10, y + 5);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(slateGrey[0], slateGrey[1], slateGrey[2]);
  doc.text('Appliance:', margin + colWidth + 10, y + 13);
  doc.setTextColor(primaryRed[0], primaryRed[1], primaryRed[2]);
  doc.setFont('helvetica', 'bold');
  doc.text(`${booking.appliance === 'AC' ? 'Air Conditioner (AC)' : 'Refrigerator (Fridge)'}`, margin + colWidth + 30, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(slateGrey[0], slateGrey[1], slateGrey[2]);
  doc.text('Reported Issue:', margin + colWidth + 10, y + 20);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  const splitIssue = doc.splitTextToSize(booking.issue || 'Standard Diagnostic & Repair', colWidth - 34);
  doc.text(splitIssue, margin + colWidth + 30, y + 20);

  y += 52;

  // 4. Assigned Master Technician Box
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'FD');

  doc.setTextColor(slateGrey[0], slateGrey[1], slateGrey[2]);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Assigned Technician:', margin + 4, y + 7);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 64, 175); // Blue
  const techName = booking.assignedTech?.name || 'Authorized Field Engineer';
  const techId = booking.assignedTech?.id ? `(${booking.assignedTech.id})` : '';
  const techPhone = booking.assignedTech?.phone || '+91 8250297411';
  const techSpecialty = booking.assignedTech?.specialty || 'Certified Appliance Expert';

  doc.text(`${techName} ${techId}`, margin + 38, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text(`Contact: ${techPhone}  |  Specialty: ${techSpecialty}`, margin + 4, y + 15);

  y += 24;

  // 5. Diagnostics & Executed Checklist
  const checklist = booking.checklist || {};
  const checkedItems = Object.keys(checklist).filter(k => checklist[k]);

  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('DIAGNOSTIC & REPAIR WORK EXECUTION CHECKLIST', margin + 4, y + 5);

  y += 10;

  if (checkedItems.length > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);

    // 2-column checklist print
    const half = Math.ceil(checkedItems.length / 2);
    for (let i = 0; i < checkedItems.length; i++) {
      const col = i < half ? 0 : 1;
      const row = i < half ? i : i - half;
      const xPos = margin + 4 + col * (contentWidth / 2);
      const yPos = y + row * 6;

      // Draw check icon
      doc.setTextColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2]);
      doc.setFont('helvetica', 'bold');
      doc.text('[DONE]', xPos, yPos);

      doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
      doc.setFont('helvetica', 'normal');
      doc.text(checkedItems[i], xPos + 14, yPos);
    }
    y += half * 6 + 6;
  } else {
    doc.setTextColor(slateGrey[0], slateGrey[1], slateGrey[2]);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.text('Standard multi-point inspection and restoration completed successfully.', margin + 4, y);
    y += 8;
  }

  // 6. Technician Remarks / Field Notes
  if (booking.techNotes) {
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
    doc.roundedRect(margin, y, contentWidth, 16, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(slateGrey[0], slateGrey[1], slateGrey[2]);
    doc.text('FIELD ENGINEER REMARKS:', margin + 4, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    const splitNotes = doc.splitTextToSize(booking.techNotes, contentWidth - 8);
    doc.text(splitNotes, margin + 4, y + 11);

    y += 20;
  } else {
    y += 4;
  }

  // 7. Payment & Invoice Breakdown Box
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(primaryRed[0], primaryRed[1], primaryRed[2]);
  doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'FD');

  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('BILLING & PAYMENT SUMMARY', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(slateGrey[0], slateGrey[1], slateGrey[2]);
  doc.text('Payment Method:', margin + 4, y + 14);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.setFont('helvetica', 'bold');
  doc.text(booking.paymentMethod || 'Cash on Service / Online', margin + 34, y + 14);

  if (booking.otp) {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(slateGrey[0], slateGrey[1], slateGrey[2]);
    doc.text('OTP Verification:', margin + 4, y + 21);
    doc.setTextColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`VERIFIED (PIN: ${booking.otp})`, margin + 34, y + 21);
  }

  // Total Amount Highlight
  doc.setFillColor(primaryRed[0], primaryRed[1], primaryRed[2]);
  doc.roundedRect(pageWidth - margin - 58, y + 4, 52, 18, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('TOTAL AMOUNT PAID', pageWidth - margin - 32, y + 9, { align: 'center' });
  doc.setFontSize(14);
  doc.text(`INR ${booking.price || (booking.appliance === 'AC' ? 499 : 299)}`, pageWidth - margin - 32, y + 18, { align: 'center' });

  y += 32;

  // 8. Terms & 30-Day Service Warranty
  doc.setFillColor(254, 242, 242); // light red
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'FD');

  doc.setTextColor(primaryRed[0], primaryRed[1], primaryRed[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('GUARANTEED 30-DAY SERVICE WARRANTY', margin + 4, y + 6);

  doc.setTextColor(slateGrey[0], slateGrey[1], slateGrey[2]);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('All parts checked and labor performed are backed by our 30-day free revisit guarantee.', margin + 4, y + 11);
  doc.text('For assistance, warranty claims, or feedback, call our toll-free support helpline.', margin + 4, y + 15);

  // 9. Footer
  const footerY = pageHeight - 16;
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(slateGrey[0], slateGrey[1], slateGrey[2]);
  doc.text('CoolFix Services India  |  Helpline: +91 8250297411  |  Email: support@coolfix.in  |  www.coolfix.in', pageWidth / 2, footerY + 5, { align: 'center' });
  doc.setFontSize(7);
  doc.text(`System Generated Digital Job Sheet  |  Generated on ${new Date().toLocaleString('en-IN')}`, pageWidth / 2, footerY + 10, { align: 'center' });

  // Auto-download file in browser
  if (autoDownload && typeof window !== 'undefined') {
    const filename = `JobSheet_${booking.jobId || 'Booking'}_CoolFix.pdf`;
    doc.save(filename);
  }

  return doc;
}

/**
 * Convenient wrapper to download a PDF Job Sheet.
 */
export function downloadJobSheetPDF(booking) {
  return generateJobSheetPDF(booking, true);
}
