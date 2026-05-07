import React from 'react';
import Markdown from 'react-markdown';

const AcademicTemplate = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, themeColor } = data;

  return (
    <div className="p-12 font-serif text-black bg-white leading-relaxed">
      <header className="mb-8 text-center border-b pb-8 border-black">
        <h1 className="text-4xl font-bold mb-4 uppercase tracking-wider" style={{ color: themeColor }}>
          {personalInfo.fullName || 'Full Name'}
        </h1>
        <div className="text-sm font-medium mb-4 italic text-black">
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-semibold text-black underline underline-offset-4">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.linkedin && <span>LinkedIn</span>}
          {personalInfo.website && <span>Portfolio</span>}
        </div>
      </header>

      <div className="space-y-10">
        {summary && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-b border-slate-900 pb-1 inline-block">Research Statement</h2>
            <div className="text-[14px]">
              {summary}
            </div>
          </section>
        )}

        {education && education.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-widest mb-6 border-b border-slate-900 pb-1 inline-block">Education</h2>
            <div className="space-y-6">
              {education.map((edu) => (
                <div key={edu.id} className="grid grid-cols-12 gap-4 break-inside-avoid">
                  <div className="col-span-3 text-xs font-bold text-black uppercase tracking-widest pt-1">
                    {edu.startDate} — {edu.endDate}
                  </div>
                  <div className="col-span-9">
                    <h3 className="text-lg font-bold leading-tight">{edu.institution}</h3>
                    <div className="text-sm italic font-medium text-black mb-2">{edu.degree}</div>
                    {edu.location && <div className="text-xs text-black">{edu.location}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-widest mb-6 border-b border-slate-900 pb-1 inline-block">Academic Experience</h2>
            <div className="space-y-8">
              {experience.map((exp) => (
                <div key={exp.id} className="grid grid-cols-12 gap-4 break-inside-avoid">
                  <div className="col-span-3 text-xs font-bold text-black uppercase tracking-widest pt-1">
                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </div>
                  <div className="col-span-9">
                    <h3 className="text-lg font-bold leading-tight">{exp.jobTitle}</h3>
                    <div className="text-sm font-bold mb-3 italic" style={{ color: themeColor }}>{exp.company}</div>
                    <div className="text-[14px] text-black academic-body">
                      <Markdown>{exp.responsibilities}</Markdown>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.projects && data.projects.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-widest mb-6 border-b border-slate-900 pb-1 inline-block">Research & Projects</h2>
            <div className="space-y-6">
              {data.projects.map((proj) => (
                <div key={proj.id} className="grid grid-cols-12 gap-4">
                  <div className="col-span-12">
                    <h3 className="text-md font-bold mb-1">{proj.name}</h3>
                    <div className="text-xs font-bold mb-2 opacity-100 italic" style={{ color: themeColor }}>{proj.technologies}</div>
                    <p className="text-[13px] text-black">{proj.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-10">
          {skills && skills.categories && skills.categories.some(c => c.list) && (
            <section className="col-span-2">
              <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-b border-slate-900 pb-1 inline-block">Expertise & Skills</h2>
              <div className="grid grid-cols-2 gap-6">
                {skills.categories.map((cat) => (
                  cat.list && (
                    <div key={cat.id}>
                      <h3 className="text-xs font-bold text-black mb-1 uppercase tracking-wider">{cat.name}</h3>
                      <p className="text-sm text-black leading-relaxed italic">{cat.list}</p>
                    </div>
                  )
                ))}
              </div>
            </section>
          )}

          {data.awards && data.awards.length > 0 && (
            <section>
              <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-b border-slate-900 pb-1 inline-block">Awards & Honors</h2>
              <div className="space-y-3">
                {data.awards.map(award => (
                  <div key={award.id} className="text-sm text-black">
                    <span className="font-bold">• {award.title}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.certifications && data.certifications.length > 0 && (
            <section>
              <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-b border-slate-900 pb-1 inline-block">Certifications</h2>
              <div className="space-y-2">
                {data.certifications.map(cert => (
                  <div key={cert.id} className="text-sm text-black">• {cert.name}</div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcademicTemplate;



