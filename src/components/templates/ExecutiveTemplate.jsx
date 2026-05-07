import React from 'react';
import Markdown from 'react-markdown';

const ExecutiveTemplate = ({ data, isThumbnail = false }) => {
  const { personalInfo, summary, experience, education, skills, themeColor } = data;

  return (
    <div className={`bg-white font-serif ${isThumbnail ? 'p-4' : 'p-16'} min-h-full text-[#333]`} id="executive-resume">
       <header className="text-center mb-12 border-b-2 border-black pb-10">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-black uppercase">
             {personalInfo.fullName}
          </h1>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-bold uppercase tracking-[0.15em] text-black font-sans">
             <span>{personalInfo.location}</span>
             <span className="text-black font-black">/</span>
             <span>{personalInfo.phone}</span>
             <span className="text-black font-black">/</span>
             <span>{personalInfo.email}</span>
             {personalInfo.linkedin && (
               <>
                 <span className="text-black font-black">/</span>
                 <span>LinkedIn</span>
               </>
             )}
          </div>
       </header>

       <div className="space-y-12">
          {summary && (
            <section className="max-w-3xl mx-auto text-center">
               <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-black mb-6 font-sans">Executive Profile</h2>
               <p className="text-lg leading-relaxed italic text-black">
                  {summary}
               </p>
            </section>
          )}

          {experience?.length > 0 && (
            <section>
               <h2 className="text-sm font-black uppercase tracking-[0.25em] text-black border-b-2 border-slate-900 pb-3 mb-8 font-sans">Professional Experience</h2>
               <div className="space-y-10">
                  {experience.map(exp => (
                    <div key={exp.id} className="space-y-4">
                       <div className="flex justify-between items-end">
                          <div>
                             <h3 className="text-xl font-black text-black">{exp.company}</h3>
                             <p className="text-base font-bold italic text-black mt-1">{exp.jobTitle}</p>
                          </div>
                          <div className="text-right">
                             <div className="text-sm font-black text-black font-sans uppercase tracking-widest">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</div>
                             <div className="text-xs font-bold text-black font-sans uppercase mt-1 tracking-wider">{exp.location}</div>
                          </div>
                       </div>
                       <div className="text-[14px] text-black prose prose-slate max-w-none prose-p:leading-relaxed prose-li:my-1">
                          <Markdown>{exp.responsibilities}</Markdown>
                       </div>
                    </div>
                  ))}
               </div>
            </section>
          )}

          <div className="grid md:grid-cols-2 gap-16">
             {education?.length > 0 && (
               <section>
                  <h2 className="text-sm font-black uppercase tracking-[0.25em] text-black border-b border-black pb-3 mb-6 font-sans text-center md:text-left">Education</h2>
                  <div className="space-y-6">
                     {education.map(edu => (
                       <div key={edu.id}>
                          <h3 className="text-base font-bold text-black">{edu.institution}</h3>
                          <p className="text-sm italic text-black">{edu.degree}</p>
                          <p className="text-[11px] font-bold text-black font-sans uppercase tracking-widest mt-1">{edu.startDate} — {edu.endDate}</p>
                       </div>
                     ))}
                  </div>
               </section>
             )}

             {skills?.categories?.length > 0 && (
               <section>
                  <h2 className="text-sm font-black uppercase tracking-[0.25em] text-black border-b border-black pb-3 mb-6 font-sans text-center md:text-left">Core Competencies</h2>
                  <div className="grid grid-cols-2 gap-6">
                     {skills.categories.map(cat => (
                       <div key={cat.id} className="space-y-2">
                          <h3 className="text-[11px] font-black uppercase tracking-wider text-black font-sans">{cat.name}</h3>
                          <div className="text-xs font-bold text-black leading-relaxed">
                             {cat.list}
                          </div>
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

export default ExecutiveTemplate;



