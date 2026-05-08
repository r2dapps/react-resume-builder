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
  const { personalInfo, summary, experience, education, skills, projects, certifications, awards, languages, strengths, interests } = data;

  const createHeading = (text) => new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 26, color: "1e293b", font: "Helvetica" })],
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 200 },
    border: { bottom: { color: "cbd5e1", space: 4, size: 6, style: "single" } }
  });

  const children = [
    // Header
    new Paragraph({
      children: [new TextRun({ text: personalInfo.fullName.toUpperCase(), bold: true, size: 52, color: "2563eb", font: "Helvetica" })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [new TextRun({ text: personalInfo.jobTitle.toUpperCase(), bold: true, size: 28, color: "475569", font: "Helvetica" })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: personalInfo.email, size: 18, color: "64748b" }),
        new TextRun({ text: "  •  ", size: 18, color: "94a3b8" }),
        new TextRun({ text: personalInfo.phone, size: 18, color: "64748b" }),
        new TextRun({ text: "  •  ", size: 18, color: "94a3b8" }),
        new TextRun({ text: personalInfo.location, size: 18, color: "64748b" }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        ...(personalInfo.linkedin ? [
          new TextRun({ text: personalInfo.linkedin, size: 16, color: "3b82f6" }),
          new TextRun({ text: "  ", size: 16 })
        ] : []),
        ...(personalInfo.website ? [
          new TextRun({ text: personalInfo.website, size: 16, color: "3b82f6" })
        ] : []),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),

    // Summary
    ...(summary ? [
      createHeading("Professional Summary"),
      new Paragraph({
        children: [new TextRun({ text: summary, size: 22, color: "334155", font: "Helvetica" })],
        spacing: { after: 300 },
        alignment: AlignmentType.JUSTIFY
      })
    ] : []),

    // Experience
    ...(experience.length > 0 ? [
      createHeading("Work Experience"),
      ...experience.flatMap(exp => [
        new Paragraph({
          children: [
            new TextRun({ text: exp.jobTitle, bold: true, size: 24, color: "0f172a" }),
            new TextRun({ text: ` at ${exp.company}`, bold: true, size: 24, color: "475569" }),
          ],
          spacing: { before: 200 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `${exp.startDate} — ${exp.endDate || 'Present'}`, size: 18, color: "64748b", italic: true }),
            ...(exp.location ? [new TextRun({ text: ` | ${exp.location}`, size: 18, color: "64748b" })] : [])
          ],
          spacing: { after: 150 }
        }),
        ...exp.responsibilities.split('\n').map(line => new Paragraph({
          children: [new TextRun({ text: line.trim().startsWith('•') || line.trim().startsWith('➢') ? line.trim() : `• ${line.trim()}`, size: 20, color: "334155" })],
          spacing: { after: 100 },
          indent: { left: 360 }
        }))
      ])
    ] : []),

    // Projects
    ...(projects?.length > 0 ? [
      createHeading("Projects"),
      ...projects.flatMap(proj => [
        new Paragraph({
          children: [
            new TextRun({ text: proj.name, bold: true, size: 24, color: "0f172a" }),
            ...(proj.technologies ? [new TextRun({ text: ` (${proj.technologies})`, italic: true, size: 20, color: "64748b" })] : [])
          ],
          spacing: { before: 200 }
        }),
        ...proj.description.split('\n').map(line => new Paragraph({
          children: [new TextRun({ text: line.trim().startsWith('•') || line.trim().startsWith('➢') ? line.trim() : `• ${line.trim()}`, size: 20, color: "334155" })],
          spacing: { after: 80 },
          indent: { left: 360 }
        }))
      ])
    ] : []),

    // Education
    ...(education.length > 0 ? [
      createHeading("Education"),
      ...education.flatMap(edu => [
        new Paragraph({
          children: [new TextRun({ text: edu.degree, bold: true, size: 24, color: "0f172a" })],
          spacing: { before: 150 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: edu.institution, size: 20, color: "475569" }),
            new TextRun({ text: ` | ${edu.startDate} — ${edu.endDate}`, size: 18, color: "64748b", italic: true })
          ],
          spacing: { after: 200 }
        })
      ])
    ] : []),

    // Skills
    ...(skills?.categories?.length > 0 ? [
      createHeading("Technical Skills"),
      ...skills.categories.map(cat => new Paragraph({
        children: [
          new TextRun({ text: `${cat.name}: `, bold: true, size: 20, color: "1e293b" }),
          new TextRun({ text: cat.list, size: 20, color: "334155" })
        ],
        spacing: { after: 100 }
      }))
    ] : []),

    // Certifications & Others
    ...(certifications?.length > 0 || awards?.length > 0 || languages?.length > 0 ? [
      createHeading("Certifications & Honors"),
      ...(certifications?.length > 0 ? [
        new Paragraph({ children: [new TextRun({ text: "Certifications: ", bold: true, size: 20 })] }),
        ...certifications.map(cert => new Paragraph({ text: `• ${cert.name}`, size: 18, indent: { left: 360 } }))
      ] : []),
      ...(awards?.length > 0 ? [
        new Paragraph({ children: [new TextRun({ text: "Awards: ", bold: true, size: 20 })], spacing: { before: 150 } }),
        ...awards.map(award => new Paragraph({ text: `• ${award.title}`, size: 18, indent: { left: 360 } }))
      ] : []),
      ...(languages?.length > 0 ? [
        new Paragraph({ children: [new TextRun({ text: "Languages: ", bold: true, size: 20 })], spacing: { before: 150 } }),
        new Paragraph({ text: languages.map(l => `${l.name} (${l.proficiency})`).join(', '), size: 18, indent: { left: 360 } })
      ] : [])
    ] : [])
  ];

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 720, right: 720, bottom: 720, left: 720 } // 0.5 inch margins
        }
      },
      children: children,
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
