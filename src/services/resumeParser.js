import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set up worker for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const extractTextFromPDF = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }
  
  return fullText;
};

export const extractTextFromDOCX = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

export const parseResumeText = (text) => {
  // Simple intelligent mapper using regex and keywords
  // This is a basic implementation that can be improved with LLMs if needed
  const data = {
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      jobTitle: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: { categories: [{ id: '1', name: 'Technical Skills', list: '' }] }
  };

  // Extract Email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) data.personalInfo.email = emailMatch[0];

  // Extract Phone
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) data.personalInfo.phone = phoneMatch[0];

  // Simple Name Extraction (first line often)
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length > 0) {
    // Usually the name is in the first 2-3 lines
    data.personalInfo.fullName = lines[0];
  }

  // Extract Skills (look for common skill names)
  const commonSkills = ["JavaScript", "React", "Node.js", "Python", "Java", "SQL", "Git", "HTML", "CSS", "TypeScript"];
  const foundSkills = commonSkills.filter(skill => text.toLowerCase().includes(skill.toLowerCase()));
  if (foundSkills.length > 0) {
    data.skills.categories[0].list = foundSkills.join(', ');
  }

  return data;
};
