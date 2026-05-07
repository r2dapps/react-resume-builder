import React from 'react';
import Markdown from 'react-markdown';

const CreativeTemplate = ({ data, isThumbnail = false }) => {
  const { personalInfo, summary, experience, education, skills, themeColor } = data;

  return (
    <div className={`bg-white font-sans ${isThumbnail ? 'p-4' : 'p-12'} min-h-full`} style={{ borderColor: themeColor }}>
      <div className="flex flex-col flex-row gap-8">
        {/* Left Sidebar */}
        <aside className="md:w-1/3 flex flex-col gap-8">
          <div className="space-y-4">
             <div 
               className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-black text-white"
               style={{ backgroundColor: themeColor }}
             >
               {personalInfo.fullName?.charAt(0)}
             </div>
             <div>
                <h1 className="text-3xl font-black tracking-tighter leading-none mb-1 uppercase" style={{ color: themeColor }}>
                  {personalInfo.fullName}
                </h1>
                <p className="text-sm font-bold text-black uppercase tracking-widest">
                   {experience?.[0]?.jobTitle || 'Professional'}
                </p>
             </div>
          </div>

          <div className="space-y-4">
             <div className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Contact</div>
             <div className="space-y-2 text-xs font-medium text-black">
                <p className="flex items-center gap-2">{personalInfo.email}</p>
                <p className="flex items-center gap-2">{personalInfo.phone}</p>
                <p className="flex items-center gap-2">{personalInfo.location}</p>
             </div>
          </div>

          {skills?.categories?.length > 0 && (
            <div className="space-y-4">
               <div className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Expertise</div>
               <div className="flex flex-wrap gap-2">
                 {skills.categories.flatMap(cat => cat.list?.split(',').map(s => s.trim()) || []).map((skill, index) => (
                   <span 
                    key={index}
                    className="px-3 py-1.5 rounded-full text-[10px] font-bold border border-black bg-transparent text-black"
                   >
                     {skill}
                   </span>
                 ))}
               </div>
            </div>
          )}

          {education?.length > 0 && (
            <div className="space-y-4">
               <div className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Education</div>
               <div className="space-y-4">
                 {education.map(edu => (
                   <div key={edu.id} className="space-y-1">
                      <div className="text-xs font-black uppercase">{edu.institution}</div>
                      <div className="text-[11px] text-black font-medium">{edu.degree}</div>
                      <div className="text-[10px] text-black font-bold">{edu.startDate} - {edu.endDate}</div>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-10">
          {summary && (
            <section className="space-y-4">
               <div className="text-[10px] font-black uppercase tracking-[0.2em] text-black">About Me</div>
               <p className="text-sm font-medium leading-relaxed text-black italic">
                  "{summary}"
               </p>
            </section>
          )}

          {experience?.length > 0 && (
            <section className="space-y-6">
               <div className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Experience</div>
               <div className="space-y-8">
                 {experience.map(exp => (
                   <div key={exp.id} className="relative pl-6 border-l-2 border-black group">
                      <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-slate-200 group-hover:bg-blue-500 transition-colors" style={{ backgroundColor: themeColor + '40' }} />
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-base font-black text-black">{exp.jobTitle}</h3>
                          <div className="text-sm font-bold uppercase tracking-wide text-black">{exp.company}</div>
                        </div>
                        <div className="text-[10px] font-black bg-transparent border border-black px-3 py-1 rounded-full text-black">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </div>
                      </div>
                      <div className="text-[13px] text-black prose-sm font-medium leading-relaxed">
                         <Markdown>{exp.responsibilities}</Markdown>
                      </div>
                   </div>
                 ))}
               </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default CreativeTemplate;



