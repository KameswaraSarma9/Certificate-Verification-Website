// PDF generation service using jsPDF
declare const jsPDF: any;

export interface CertificateData {
  id: string;
  studentName: string;
  institutionName: string;
  certificateType: string;
  degreeProgram: string;
  graduationDate: string;
  gpa?: string;
  certificateNumber?: string;
  blockchainHash: string;
  issuedAt: string;
  issuer: string;
}

export function generateCertificatePDF(certificate: CertificateData): void {
  try {
    // Fallback for environments where jsPDF is not available
    if (typeof jsPDF === 'undefined') {
      // Create a simple text file download as fallback
      const content = `
CERTIFICATE OF COMPLETION
Blockchain-Verified Academic Certificate

Student: ${certificate.studentName}
Institution: ${certificate.institutionName}
Degree: ${formatCertificateType(certificate.certificateType)} in ${certificate.degreeProgram}
Graduation Date: ${new Date(certificate.graduationDate).toLocaleDateString()}
${certificate.gpa ? `GPA: ${certificate.gpa}` : ''}

BLOCKCHAIN VERIFICATION
Certificate ID: ${certificate.id}
Blockchain Hash: ${certificate.blockchainHash}
Issued: ${new Date(certificate.issuedAt).toLocaleString()}

This certificate is secured by blockchain technology and cannot be forged or tampered with.
Verify at: certchain.app/verify
`;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${certificate.studentName.replace(/\s+/g, '_')}_${certificate.degreeProgram.replace(/\s+/g, '_')}_Certificate.txt`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      return;
    }

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Set up colors
    const primaryColor = '#030213';
    const accentColor = '#3b82f6';

    // Add background
    doc.setFillColor(250, 250, 250);
    doc.rect(0, 0, 297, 210, 'F');

    // Add border
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190);

    // Add decorative elements
    doc.setFillColor(accentColor);
    doc.circle(30, 30, 8, 'F');
    doc.circle(267, 30, 8, 'F');
    doc.circle(30, 180, 8, 'F');
    doc.circle(267, 180, 8, 'F');

    // Title
    doc.setFontSize(28);
    doc.setTextColor(primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('CERTIFICATE OF COMPLETION', 148.5, 50, { align: 'center' });

    // Subtitle
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Blockchain-Verified Academic Certificate', 148.5, 60, { align: 'center' });

    // Student name
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor);
    doc.text(certificate.studentName, 148.5, 85, { align: 'center' });

    // Achievement text
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('has successfully completed the requirements for', 148.5, 95, { align: 'center' });

    // Degree program
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(accentColor);
    const degreeType = formatCertificateType(certificate.certificateType);
    doc.text(`${degreeType} in ${certificate.degreeProgram}`, 148.5, 110, { align: 'center' });

    // Institution
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(primaryColor);
    doc.text(`at ${certificate.institutionName}`, 148.5, 120, { align: 'center' });

    // Date
    doc.setFontSize(12);
    doc.text(`Graduation Date: ${new Date(certificate.graduationDate).toLocaleDateString()}`, 148.5, 135, { align: 'center' });

    // GPA if available
    if (certificate.gpa) {
      doc.text(`GPA: ${certificate.gpa}`, 148.5, 145, { align: 'center' });
    }

    // Blockchain verification section
    doc.setFillColor(240, 248, 255);
    doc.rect(20, 155, 257, 25, 'F');
    doc.setDrawColor(accentColor);
    doc.setLineWidth(1);
    doc.rect(20, 155, 257, 25);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(accentColor);
    doc.text('BLOCKCHAIN VERIFICATION', 25, 163);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(`Certificate ID: ${certificate.id}`, 25, 169);
    doc.text(`Blockchain Hash: ${certificate.blockchainHash}`, 25, 175);
    doc.text(`Issued: ${new Date(certificate.issuedAt).toLocaleString()}`, 180, 169);
    doc.text(`Verify at: certchain.app/verify`, 180, 175);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('This certificate is secured by blockchain technology and cannot be forged or tampered with.', 148.5, 195, { align: 'center' });

    // Download the PDF
    const filename = `${certificate.studentName.replace(/\s+/g, '_')}_${certificate.degreeProgram.replace(/\s+/g, '_')}_Certificate.pdf`;
    doc.save(filename);
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
}

function formatCertificateType(type: string): string {
  const types: { [key: string]: string } = {
    bachelor: "Bachelor's Degree",
    master: "Master's Degree",
    phd: "Doctor of Philosophy",
    diploma: "Diploma",
    certificate: "Certificate"
  };
  return types[type] || type;
}