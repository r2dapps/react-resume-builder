import React from 'react';
import Markdown from 'react-markdown';

const SingleColumn = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, awards, interests, strengths, themeColor } = data;

  return (
    <div className="space-y-8 text-black font-sans p-8">
      {/* Header */}
      <div className="text-center space-y-3 pb-8 border-b-2" style={{ borderColor: themeColor }}>
        <h1 className="text-4xl font-extrabold uppercase tracking-tight text-black" style={{ color: themeColor }}>{personalInfo.fullName}</h1>
        {personalInfo.jobTitle && <h2 className="text-xl font-medium text-black uppercase tracking-widest">{personalInfo.jobTitle}</h2>}
        <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-black font-medium">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.email && personalInfo.phone && <span className="text-black">•</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {(personalInfo.email || personalInfo.phone) && personalInfo.location && <span className="text-black">•</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {(personalInfo.email || personalInfo.phone || personalInfo.location) && personalInfo.website && <span className="text-black">•</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="break-inside-avoid">
          <h2 className="text-lg font-bold uppercase tracking-widest text-black mb-3" style={{ color: themeColor }}>Professional Summary</h2>
          <div className="text-black leading-relaxed text-[15px] prose prose-slate">
            {summary}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && experience.some(exp => exp.jobTitle || exp.company) && (
        <div>
          <h2 className="text-lg font-bold uppercase tracking-widest text-black mb-4 pb-1 border-b" style={{ borderColor: themeColor }}>Experience</h2>
          <div className="space-y-6">
            {experience.map((exp) => (
              (exp.jobTitle || exp.company) && (
                <div key={exp.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-[17px] font-bold text-black">{exp.jobTitle}</h3>
                    <span className="text-sm font-bold text-black tabular-nums italic uppercase tracking-wider">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <div className="text-black font-medium mb-2">{exp.company} {exp.location && `| ${exp.location}`}</div>
                  {exp.responsibilities && (
                    <div className="text-black text-[14px] leading-relaxed prose prose-slate max-w-none">
                      <Markdown>{exp.responsibilities}</Markdown>
                    </div>
                  )}
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills && skills.categories && skills.categories.length > 0 && skills.categories.some(cat => cat.list) && (
        <div className="break-inside-avoid">
          <h2 className="text-lg font-bold uppercase tracking-widest text-black mb-4 pb-1 border-b" style={{ borderColor: themeColor }}>Skills</h2>
          <div className="grid grid-cols-1 gap-2">
            {skills.categories.map((cat) => (
              cat.list && (
                <div key={cat.id} className="flex flex-col flex-row md:items-start gap-1 md:gap-4 break-inside-avoid">
                  <h3 className="text-[15px] font-bold text-black min-w-[160px]">{cat.name}:</h3>
                  <p className="text-black text-[14px] leading-relaxed font-sans">{cat.list}</p>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && education.some(edu => edu.degree || edu.institution) && (
        <div>
          <h2 className="text-lg font-bold uppercase tracking-widest text-black mb-4 pb-1 border-b" style={{ borderColor: themeColor }}>Education</h2>
          <div className="space-y-4">
            {education.map((edu) => (
              (edu.degree || edu.institution) && (
                <div key={edu.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-[16px] font-bold text-black">{edu.degree}</h3>
                    <span className="text-sm font-bold text-black tabular-nums italic">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <div className="text-black">{edu.institution} {edu.gpa && <span className="font-medium">| GPA: {edu.gpa}</span>}</div>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && projects.some(proj => proj.name) && (
        <div>
          <h2 className="text-lg font-bold uppercase tracking-widest text-black mb-4 pb-1 border-b" style={{ borderColor: themeColor }}>Projects</h2>
          <div className="space-y-4">
            {projects.map((proj) => (
              proj.name && (
                <div key={proj.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[16px] font-bold text-black">{proj.name}</h3>
                      {proj.link && <a href={proj.link} className="text-sm text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Link</a>}
                    </div>
                  </div>
                  {proj.technologies && <div className="text-sm font-medium text-black mb-2">{proj.technologies}</div>}
                  {proj.description && (
                    <div className="text-black text-[14px] leading-relaxed prose prose-slate max-w-none">
                      <Markdown>{proj.description}</Markdown>
                    </div>
                  )}
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Certifications and others can be added similarly */}
      {certifications && certifications.length > 0 && certifications.some(cert => cert.name) && (
         <div className="break-inside-avoid">
            <h2 className="text-lg font-bold uppercase tracking-widest text-black mb-3 pb-1 border-b" style={{ borderColor: themeColor }}>Certifications</h2>
            <ul className="list-disc list-inside text-black text-[14px] leading-relaxed space-y-1">
              {certifications.map(cert => cert.name && <li key={cert.id}>{cert.name} {cert.date && <span className="text-black">({cert.date})</span>}</li>)}
            </ul>
         </div>
      )}
    </div>
  );
};

export default SingleColumn;



