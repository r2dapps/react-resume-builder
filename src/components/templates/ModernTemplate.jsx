import React from 'react';
import Markdown from 'react-markdown';

const ModernTemplate = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, themeColor } = data;

  return (
    <div className="p-10 font-sans text-black bg-white">
      <header className="mb-10 border-b-4 pb-8" style={{ borderColor: themeColor }}>
        <h1 className="text-5xl font-black tracking-tighter uppercase mb-2" style={{ color: themeColor }}>
          {personalInfo.fullName || 'Full Name'}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm font-bold uppercase tracking-widest text-black">
          <span className="bg-black text-white px-3 py-1">{personalInfo.jobTitle || 'Job Title'}</span>
          <span>{personalInfo.location}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-black">
          <span>{personalInfo.email}</span>
          {personalInfo.phone && <span>| {personalInfo.phone}</span>}
          {personalInfo.linkedin && <span>| {personalInfo.linkedin}</span>}
          {personalInfo.website && <span>| {personalInfo.website}</span>}
        </div>
      </header>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-8 space-y-10">
          {summary && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-black border-l-4 pl-3" style={{ borderColor: themeColor }}>Profile</h2>
              <div className="text-[15px] leading-relaxed text-black">
                {summary}
              </div>
            </section>
          )}

          {experience && experience.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-black border-l-4 pl-3" style={{ borderColor: themeColor }}>Experience</h2>
              <div className="space-y-8">
                {experience.map((exp) => (
                  <div key={exp.id} className="break-inside-avoid">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-xl font-bold text-black">{exp.jobTitle}</h3>
                      <span className="text-xs font-bold tabular-nums text-black border border-black px-2 py-1 rounded">
                        {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: themeColor }}>{exp.company}</div>
                    <div className="text-[14px] leading-relaxed text-black">
                      <Markdown>{exp.responsibilities}</Markdown>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.projects && data.projects.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-black border-l-4 pl-3" style={{ borderColor: themeColor }}>Projects</h2>
              <div className="space-y-6">
                {data.projects.map((proj) => (
                  <div key={proj.id}>
                    <h3 className="text-lg font-bold text-black">{proj.name}</h3>
                    <div className="text-xs font-bold mb-2 uppercase tracking-wider opacity-100" style={{ color: themeColor }}>{proj.technologies}</div>
                    <p className="text-sm text-black">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="col-span-4 space-y-10 opacity-100">
          {skills && skills.categories && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-black border-l-4 pl-3" style={{ borderColor: themeColor }}>Expertise</h2>
              <div className="space-y-4">
                {skills.categories.map((cat) => (
                  cat.list && (
                    <div key={cat.id}>
                      <h3 className="text-xs font-bold text-black mb-1 uppercase tracking-wider">{cat.name}</h3>
                      <p className="text-sm text-black leading-relaxed">{cat.list}</p>
                    </div>
                  )
                ))}
              </div>
            </section>
          )}

          {education && education.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-black border-l-4 pl-3" style={{ borderColor: themeColor }}>Education</h2>
              <div className="space-y-6">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="text-sm font-bold text-black">{edu.degree}</h3>
                    <div className="text-xs text-black mb-1">{edu.institution}</div>
                    <div className="text-[10px] font-bold text-black uppercase tracking-widest">{edu.startDate} — {edu.endDate}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.certifications && data.certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-black border-l-4 pl-3" style={{ borderColor: themeColor }}>Certifications</h2>
              <div className="space-y-2">
                {data.certifications.map(cert => (
                  <div key={cert.id} className="text-sm text-black font-medium">• {cert.name}</div>
                ))}
              </div>
            </section>
          )}

          {data.languages && data.languages.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-black border-l-4 pl-3" style={{ borderColor: themeColor }}>Languages</h2>
              <div className="space-y-1">
                {data.languages.map(lang => (
                  <div key={lang.id} className="text-sm text-black">
                    <span className="font-bold">{lang.name}</span>
                    {lang.proficiency && <span className="text-black italic flex text-[10px]">({lang.proficiency})</span>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.strengths && (
            <section>
               <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-2 text-black border-l-4 pl-3" style={{ borderColor: themeColor }}>Strengths</h2>
               <p className="text-sm text-black leading-relaxed italic">{data.strengths}</p>
            </section>
          )}

          {data.awards && data.awards.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-black border-l-4 pl-3" style={{ borderColor: themeColor }}>Awards</h2>
              <div className="space-y-2">
                {data.awards.map(award => (
                  <div key={award.id} className="text-sm text-black font-medium whitespace-pre-wrap">• {award.title}</div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;



