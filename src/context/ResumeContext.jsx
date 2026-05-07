import { createContext, useContext, useState, useEffect } from 'react';

export const INITIAL_STATE = {
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: ''
  },
  summary: '',
  experience: [],
  education: [],
  skills: { 
    categories: [
      { id: '1', name: 'Technical Skills', list: '' }
    ] 
  },
  projects: [],
  certifications: [],
  awards: [],
  languages: [],
  interests: '',
  strengths: '',
  template: 'modern',
  themeColor: '#2563eb'
};

const ResumeContext = createContext();

export const ResumeProvider = ({ children }) => {
  const [resumeData, setResumeData] = useState(INITIAL_STATE);
  const [isReady, setIsReady] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('resume-builder-data');
    if (saved) {
      try {
        setResumeData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved resume data', e);
      }
    }
    setIsReady(true);
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    if (isReady) {
      localStorage.setItem('resume-builder-data', JSON.stringify(resumeData));
    }
  }, [resumeData, isReady]);

  const updatePersonal = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const updateSummary = (value) => {
    setResumeData(prev => ({ ...prev, summary: value }));
  };

  const updateArrayItem = (section, id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayItem = (section, emptyItem) => {
    setResumeData(prev => ({
      ...prev,
      [section]: [...prev[section], { ...emptyItem, id: Date.now().toString() }]
    }));
  };

  const removeArrayItem = (section, id) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item.id !== id)
    }));
  };

  const updateSkill = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        categories: prev.skills.categories.map(cat => 
          cat.id === id ? { ...cat, [field]: value } : cat
        )
      }
    }));
  };
  
  const value = {
    resumeData,
    setResumeData,
    updatePersonal,
    updateSummary,
    updateArrayItem,
    addArrayItem,
    removeArrayItem,
    updateSkill,
    isReady
  };

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) throw new Error('useResume must be used within a ResumeProvider');
  return context;
};
