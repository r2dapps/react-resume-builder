import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { jsPDF } from 'jspdf';
import { generatePurePDF } from './pdfEngine';

export const downloadPDF = async (data, filename = 'resume.pdf') => {
  try {
    const pdfDoc = await generatePurePDF(data);
    pdfDoc.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const downloadDOCX = async (data, filename = 'resume.docx') => {
  const { personalInfo, summary, experience, education, skills, projects } = data;

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Name
        new Paragraph({
          children: [new TextRun({ text: personalInfo.fullName.toUpperCase(), bold: true, size: 48, color: "2563eb" })],
          alignment: AlignmentType.CENTER,
        }),
        // Job Title
        new Paragraph({
          children: [new TextRun({ text: personalInfo.jobTitle.toUpperCase(), size: 28, color: "666666" })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        // Contact Info
        new Paragraph({
          children: [new TextRun({ text: `${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.location}`, size: 20 })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),

        // Summary
        ...(summary ? [
          new Paragraph({ text: "PROFESSIONAL SUMMARY", heading: HeadingLevel.HEADING_2, border: { bottom: { color: "000000", space: 1, size: 6, style: "single" } } }),
          new Paragraph({ children: [new TextRun({ text: summary, size: 22 })], spacing: { before: 200, after: 400 } })
        ] : []),

        // Experience
        ...(experience.length > 0 ? [
          new Paragraph({ text: "WORK EXPERIENCE", heading: HeadingLevel.HEADING_2 }),
          ...experience.flatMap(exp => [
            new Paragraph({
              children: [
                new TextRun({ text: exp.jobTitle, bold: true, size: 24 }),
                new TextRun({ text: ` | ${exp.company}`, size: 24 }),
              ]
            }),
            new Paragraph({ text: `${exp.startDate} - ${exp.endDate || 'Present'}`, spacing: { after: 100 } }),
            new Paragraph({ text: exp.responsibilities, spacing: { after: 300 } })
          ])
        ] : []),
        
        // Education
        ...(education.length > 0 ? [
          new Paragraph({ text: "EDUCATION", heading: HeadingLevel.HEADING_2 }),
          ...education.flatMap(edu => [
             new Paragraph({ children: [new TextRun({ text: edu.degree, bold: true, size: 24 })] }),
             new Paragraph({ text: edu.institution, spacing: { after: 300 } })
          ])
        ] : [])
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
