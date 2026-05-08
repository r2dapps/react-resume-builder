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
    skills: { categories: [] }
  };

  // Clean text
  const cleanText = text.replace(/\r/g, '');
  const lines = cleanText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  // Extract Email
  const emailMatch = cleanText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) data.personalInfo.email = emailMatch[0];

  // Extract Phone
  const phoneMatch = cleanText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) data.personalInfo.phone = phoneMatch[0];

  // Extract Name (usually first line if not a label)
  if (lines.length > 0) {
    const firstLine = lines[0];
    if (!firstLine.toLowerCase().includes('resume') && !firstLine.toLowerCase().includes('curriculum')) {
      data.personalInfo.fullName = firstLine.replace(/[^a-zA-Z\s]/g, '').trim();
    }
  }

  // Section-based extraction
  let currentSection = '';
  let sectionContent = [];

  const sectionHeaders = [
    { id: 'experience', keywords: ['experience summary', 'work experience', 'professional experience', 'employment history'] },
    { id: 'education', keywords: ['education details', 'education', 'academic background', 'academic details'] },
    { id: 'skills', keywords: ['technical skills', 'technical expertise', 'skills', 'expertise', 'core competencies'] },
    { id: 'projects', keywords: ['project details', 'projects', 'key projects', 'personal projects'] },
    { id: 'summary', keywords: ['professional summary', 'summary', 'profile', 'career objective'] }
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    let foundSection = false;

    for (const section of sectionHeaders) {
      if (section.keywords.some(k => line.includes(k))) {
        // Save previous section
        processSection(currentSection, sectionContent, data);
        
        currentSection = section.id;
        sectionContent = [];
        foundSection = true;
        break;
      }
    }

    if (!foundSection && currentSection) {
      sectionContent.push(lines[i]);
    }
  }
  // Process last section
  processSection(currentSection, sectionContent, data);

  // Fallback for skills if categories are empty
  if (data.skills.categories.length === 0) {
    const commonSkills = ["JavaScript", "React", "Node.js", "Python", "Java", "SQL", "Git", "HTML", "CSS", "TypeScript", "AWS", "Snowflake", "ETL", "Testing"];
    const foundSkills = commonSkills.filter(skill => cleanText.toLowerCase().includes(skill.toLowerCase()));
    if (foundSkills.length > 0) {
      data.skills.categories.push({ id: '1', name: 'Technical Skills', list: foundSkills.join(', ') });
    }
  }

  return data;
};

const processSection = (section, content, data) => {
  if (content.length === 0) return;

  switch (section) {
    case 'summary':
      data.summary = content.join(' ').replace(/\s+/g, ' ').trim();
      break;
    case 'skills':
      // Try to parse categories
      content.forEach(line => {
        if (line.includes(':')) {
          const [name, list] = line.split(':');
          data.skills.categories.push({
            id: Math.random().toString(36).substr(2, 9),
            name: name.trim(),
            list: list.trim()
          });
        } else if (data.skills.categories.length > 0) {
          const lastCat = data.skills.categories[data.skills.categories.length - 1];
          if (!lastCat.list.includes(line.trim())) {
            lastCat.list += (lastCat.list ? ', ' : '') + line.trim();
          }
        }
      });
      break;
    case 'experience':
      let currentExp = null;
      content.forEach(line => {
        if (line.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|20\d{2})/i) && (line.includes('Worked') || line.includes('Working') || line.includes('Sr.'))) {
          if (currentExp) data.experience.push(currentExp);
          const parts = line.split(/\b(for|from|to|at)\b/i);
          currentExp = {
            id: Math.random().toString(36).substr(2, 9),
            jobTitle: parts[0].replace(/➢|Worked as|Working as/gi, '').trim(),
            company: parts[1] ? parts[1].trim() : '',
            startDate: '',
            endDate: '',
            responsibilities: ''
          };
        } else if (line.startsWith('➢') || line.startsWith('•')) {
          if (currentExp) {
            currentExp.responsibilities += (currentExp.responsibilities ? '\n' : '') + line.substring(1).trim();
          }
        }
      });
      if (currentExp) data.experience.push(currentExp);
      break;
    case 'projects':
      if (!data.projects) data.projects = [];
      let currentProj = null;
      content.forEach(line => {
        if (line.toLowerCase().includes('project') && (line.includes('#') || line.includes(':'))) {
          if (currentProj) data.projects.push(currentProj);
          currentProj = {
            id: Math.random().toString(36).substr(2, 9),
            name: line.trim(),
            technologies: '',
            description: ''
          };
        } else if (line.toLowerCase().includes('environment')) {
          if (currentProj) currentProj.technologies = line.split(':')[1]?.trim() || '';
        } else if (line.startsWith('➢') || line.startsWith('•')) {
          if (currentProj) currentProj.description += (currentProj.description ? '\n' : '') + line.substring(1).trim();
        }
      });
      if (currentProj) data.projects.push(currentProj);
      break;
    case 'education':
      content.forEach(line => {
        if (line.trim() && line.length > 5) {
          data.education.push({
            id: Math.random().toString(36).substr(2, 9),
            degree: line.replace(/➢|•/g, '').trim(),
            institution: '',
            startDate: '',
            endDate: ''
          });
        }
      });
      break;
  }
};
