import React from 'react';
import Markdown from 'react-markdown';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

const ProfessionalTemplate = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, themeColor } = data;

  return (
    <div className="font-sans text-black bg-white min-h-[1100px]">
      <header className="p-12 text-white" style={{ backgroundColor: themeColor }}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tight mb-2 uppercase">{personalInfo.fullName || 'Full Name'}</h1>
          <p className="text-2xl font-medium mb-8 tracking-wide">{personalInfo.jobTitle || 'Professional Role'}</p>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm border-t border-white/40 pt-6">
            <span className="flex items-center gap-2"><Mail size={14} /> {personalInfo.email}</span>
            {personalInfo.phone && <span className="flex items-center gap-2"><Phone size={14} /> {personalInfo.phone}</span>}
            {personalInfo.location && <span className="flex items-center gap-2"><MapPin size={14} /> {personalInfo.location}</span>}
            {personalInfo.linkedin && <span className="flex items-center gap-2"><Linkedin size={14} /> {personalInfo.linkedin}</span>}
            {personalInfo.website && <span className="flex items-center gap-2"><Globe size={14} /> {personalInfo.website}</span>}
          </div>
        </div>
      </header>

      <div className="p-12 max-w-5xl mx-auto grid grid-cols-12 gap-12">
        <div className="col-span-8 space-y-12">
          {summary && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-4 text-black">
                <span className="w-8 h-[2px]" style={{ backgroundColor: themeColor }}></span>
                Summary
              </h2>
              <div className="text-black leading-relaxed text-[15px]">
                {summary}
              </div>
            </section>
          )}

          {experience && experience.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest mb-8 flex items-center gap-4 text-black">
                <span className="w-8 h-[2px]" style={{ backgroundColor: themeColor }}></span>
                Professional Experience
              </h2>
              <div className="space-y-10">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative pl-8 border-l-2 border-black p-0 rounded-r-xl">
                    <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-white" style={{ backgroundColor: themeColor }}></div>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-xl font-bold text-black">{exp.jobTitle}</h3>
                      <span className="text-xs font-bold text-black">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: themeColor }}>{exp.company}</div>
                    <div className="text-[14px] text-black leading-relaxed">
                      <Markdown>{exp.responsibilities}</Markdown>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.projects && data.projects.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest mb-8 flex items-center gap-4 text-black">
                <span className="w-8 h-[2px]" style={{ backgroundColor: themeColor }}></span>
                Selected Projects
              </h2>
              <div className="grid grid-cols-1 gap-6">
                {data.projects.map((proj) => (
                  <div key={proj.id} className="bg-transparent p-6 rounded-xl border border-black">
                    <h3 className="text-lg font-bold text-black mb-1">{proj.name}</h3>
                    <div className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: themeColor }}>{proj.technologies}</div>
                    <p className="text-sm text-black italic">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="col-span-4 space-y-10">
          {skills && skills.categories && (
            <section>
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 pb-2 border-b-2" style={{ color: themeColor, borderColor: themeColor }}>Expertise</h2>
              <div className="space-y-5">
                {skills.categories.map((cat) => (
                  cat.list && (
                    <div key={cat.id}>
                      <div className="text-[10px] font-bold text-black mb-2 uppercase tracking-widest">{cat.name}</div>
                      <div className="flex flex-wrap gap-2">
                        {cat.list.split(',').map((s, i) => (
                          <span key={i} className="text-[11px] font-bold text-black">
                            • {s.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </section>
          )}

          {education && education.length > 0 && (
            <section>
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 pb-2 border-b-2" style={{ color: themeColor, borderColor: themeColor }}>Education</h2>
              <div className="space-y-6">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="text-[10px] font-bold text-black mb-1 uppercase tracking-widest">{edu.startDate} - {edu.endDate}</div>
                    <h3 className="text-sm font-bold text-black">{edu.degree}</h3>
                    <div className="text-xs text-black">{edu.institution}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.languages && data.languages.length > 0 && (
             <section>
                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 pb-2 border-b-2" style={{ color: themeColor, borderColor: themeColor }}>Languages</h2>
                <div className="space-y-2">
                   {data.languages.map(lang => (
                      <div key={lang.id} className="text-sm">
                         <span className="font-bold text-black">{lang.name}</span>
                         <span className="text-black text-xs ml-2">({lang.proficiency})</span>
                      </div>
                   ))}
                </div>
             </section>
          )}

          {data.strengths && (
             <section className="bg-transparent p-4 rounded-lg border-l-4" style={{ borderColor: themeColor }}>
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-black mb-2">My Strength</h2>
                <p className="text-xs text-black leading-relaxed font-medium italic">{data.strengths}</p>
             </section>
          )}

          {data.awards && data.awards.length > 0 && (
            <section>
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 pb-2 border-b-2" style={{ color: themeColor, borderColor: themeColor }}>Honors & Awards</h2>
              <div className="space-y-4">
                {data.awards.map(award => (
                  <div key={award.id}>
                    <div className="text-sm font-bold text-black">{award.title}</div>
                    {award.issuer && <div className="text-[10px] text-black uppercase tracking-widest">{award.issuer}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalTemplate;



