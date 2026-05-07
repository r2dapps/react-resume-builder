import React from 'react';
import ModernTemplate from '../templates/ModernTemplate';
import ProfessionalTemplate from '../templates/ProfessionalTemplate';
import DoubleColumn from '../templates/DoubleColumn'; // This is used for two-column
import MinimalTemplate from '../templates/MinimalTemplate';
import ATSTemplate from '../templates/ATSTemplate';
import CreativeTemplate from '../templates/CreativeTemplate';
import ExecutiveTemplate from '../templates/ExecutiveTemplate';
import AcademicTemplate from '../templates/AcademicTemplate';
import TechTemplate from '../templates/TechTemplate';
import { dummyResumeData } from '../../constants/dummyData';
import { Sparkles } from 'lucide-react';

export const ResumeDocument = ({ data, template, isThumbnail = false }) => {
  // Check if critical data is empty to show placeholder in preview
  const isDataEmpty = !data?.personalInfo?.fullName && !data?.summary && (!data?.experience || data.experience.length === 0);
  
  const displayData = isDataEmpty && !isThumbnail 
    ? { ...dummyResumeData, template: data?.template || 'modern', themeColor: data?.themeColor || '#2563eb' } 
    : data;

  if (!displayData) return null;

  const props = { data: displayData, isThumbnail };

  let templateContent;
  switch (template) {
    case 'modern':
      templateContent = <ModernTemplate {...props} />;
      break;
    case 'professional':
      templateContent = <ProfessionalTemplate {...props} />;
      break;
    case 'two-column':
    case 'double-column':
      templateContent = <DoubleColumn {...props} />;
      break;
    case 'minimal':
      templateContent = <MinimalTemplate {...props} />;
      break;
    case 'ats-standard':
      templateContent = <ATSTemplate {...props} />;
      break;
    case 'creative':
      templateContent = <CreativeTemplate {...props} />;
      break;
    case 'executive':
      templateContent = <ExecutiveTemplate {...props} />;
      break;
    case 'academic':
      templateContent = <AcademicTemplate {...props} />;
      break;
    case 'technology':
    case 'tech':
      templateContent = <TechTemplate {...props} />;
      break;
    default:
      templateContent = <ModernTemplate {...props} />;
  }

  return (
    <div className={isThumbnail ? 'thumbnail-mode w-full h-full overflow-hidden' : 'w-full min-h-[297mm] relative'}>
      {templateContent}
    </div>
  );
};
