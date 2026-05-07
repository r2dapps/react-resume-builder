import React from 'react';
import Markdown from 'react-markdown';

const TechTemplate = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, themeColor } = data;

  return (
    <div className="flex min-h-[297mm] bg-white text-black font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white p-8 border-r border-black flex flex-col space-y-10 shrink-0">
        <header className="mb-8">
          <div className="w-16 h-2 bg-black mb-6" style={{ backgroundColor: themeColor }}></div>
          <h1 className="text-3xl font-black tracking-tighter leading-none mb-1">
            {personalInfo.fullName?.split(' ')[0] || 'FIRST'}
            <br />
            <span className="text-black">{personalInfo.fullName?.split(' ').slice(1).join(' ') || 'LAST'}</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black mt-2">
            {personalInfo.jobTitle || 'DEVELOPER'}
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-black pb-1 border-b border-black">Contact</h2>
          <div className="space-y-2 text-[11px] font-medium break-all">
            <div className="flex flex-col">
              <span className="text-black uppercase text-[9px] font-bold">Email</span>
              <span>{personalInfo.email}</span>
            </div>
            {personalInfo.phone && (
              <div className="flex flex-col">
                <span className="text-black uppercase text-[9px] font-bold">Phone</span>
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex flex-col">
                <span className="text-black uppercase text-[9px] font-bold">LinkedIn</span>
                <span>{personalInfo.linkedin}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex flex-col">
                <span className="text-black uppercase text-[9px] font-bold">Location</span>
                <span>{personalInfo.location}</span>
              </div>
            )}
          </div>
        </section>

        {skills && skills.categories && (
          <section className="space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-black pb-1 border-b border-black">Stack</h2>
            {skills.categories.map((cat) => (
              cat.list && (
                <div key={cat.id} className="space-y-2">
                  <h3 className="text-[10px] font-bold text-black uppercase tracking-wider">{cat.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {cat.list.split(',').map((skill, i) => (
                      <span key={i} className="px-2.5 py-1.5 bg-white border border-black rounded text-[9px] font-bold text-black uppercase tracking-tight">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )
            ))}
          </section>
        )}

        {data.languages && data.languages.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-black pb-1 border-b border-black">Languages</h2>
            <div className="space-y-2">
              {data.languages.map(lang => (
                <div key={lang.id} className="flex justify-between text-[11px]">
                  <span className="font-bold">{lang.name}</span>
                  <span className="text-black">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-16 space-y-12">
        {summary && (
          <section>
            <div className="flex items-center space-x-3 mb-4">
               <div className="w-8 h-px bg-black"></div>
               <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-black">About Me</h2>
            </div>
            <p className="text-[15px] leading-relaxed font-medium text-black">
              {summary}
            </p>
          </section>
        )}

        {experience && experience.length > 0 && (
          <section>
            <div className="flex items-center space-x-3 mb-8">
               <div className="w-8 h-px bg-black"></div>
               <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-black">Work History</h2>
            </div>
            <div className="space-y-10">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-6 border-l-2 border-black break-inside-avoid">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-black group-hover:border-blue-500 transition-colors" style={{ borderColor: themeColor }}></div>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-xl font-black tracking-tight text-black">{exp.jobTitle}</h3>
                    <span className="text-[10px] font-black tabular-nums text-black bg-transparent border border-black px-2.5 py-1.5 rounded">
                      {exp.startDate} — {exp.current ? 'PRESENT' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-sm font-black uppercase tracking-widest mb-4" style={{ color: themeColor }}>{exp.company}</div>
                  <div className="text-[14px] leading-relaxed text-black font-medium">
                    <Markdown>{exp.responsibilities}</Markdown>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.projects && data.projects.length > 0 && (
          <section>
            <div className="flex items-center space-x-3 mb-8">
               <div className="w-8 h-px bg-black"></div>
               <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-black">Open Source & Projects</h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {data.projects.map((proj) => (
                <div key={proj.id} className="p-5 bg-transparent rounded-xl border border-black hover:border-blue-500 transition-all group break-inside-avoid">
                  <h3 className="text-sm font-black text-black mb-1 group-hover:text-blue-600 transition-colors">{proj.name}</h3>
                  <div className="font-mono text-[9px] mb-3 p-1.5 bg-white border border-black inline-block text-black uppercase tracking-tighter">{proj.technologies}</div>
                  <p className="text-[12px] text-black leading-relaxed font-medium line-clamp-3">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-10">
          {education && education.length > 0 && (
            <section>
              <div className="flex items-center space-x-3 mb-6">
                 <div className="w-8 h-px bg-black"></div>
                 <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-black">Education</h2>
              </div>
              <div className="space-y-6">
                {education.map((edu) => (
                  <div key={edu.id} className="break-inside-avoid">
                    <h3 className="text-sm font-black text-black uppercase tracking-tight">{edu.degree}</h3>
                    <div className="text-xs font-bold text-black mb-1">{edu.institution}</div>
                    <div className="text-[10px] font-black text-black uppercase tracking-widest">{edu.startDate} — {edu.endDate}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(data.certifications?.length > 0 || data.awards?.length > 0) && (
            <section>
               <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-px bg-black"></div>
                  <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-black">Milestones</h2>
               </div>
               <ul className="space-y-3">
                  {data.certifications?.map(cert => (
                    <li key={cert.id} className="text-[12px] font-medium text-black flex items-start space-x-2 break-inside-avoid">
                       <span className="text-black">•</span>
                       <span>{cert.name}</span>
                    </li>
                  ))}
                  {data.awards?.map(award => (
                    <li key={award.id} className="text-[12px] font-medium text-black flex items-start space-x-2 break-inside-avoid">
                       <span className="text-black">•</span>
                       <span>{award.title}</span>
                    </li>
                  ))}
               </ul>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default TechTemplate;



