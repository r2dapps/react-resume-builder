import React from 'react';
import Markdown from 'react-markdown';
import { Phone, Mail, MapPin, Globe } from 'lucide-react';

const DoubleColumn = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications, themeColor } = data;

  return (
    <div className="font-sans bg-white min-h-[1122px] flex flex-col">
      {/* Header Bar */}
      <header className="bg-black text-white p-12 py-10 flex flex-col justify-center">
        <h1 className="text-4xl font-extrabold uppercase tracking-[0.15em] mb-1">
          {personalInfo.fullName}
        </h1>
        <p className="text-lg text-black uppercase tracking-[0.3em] font-light">
          {personalInfo.jobTitle}
        </p>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Column (Sidebar) */}
        <aside className="w-[35%] bg-white p-8 space-y-8 border-r border-black">
          {summary && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="font-bold text-xs uppercase tracking-[0.2em] text-black">About Me</h2>
                <div className="flex-1 h-[1px] bg-slate-200"></div>
              </div>
              <div className="text-[12px] leading-relaxed text-black prose prose-slate max-w-none prose-sm">
                {summary}
              </div>
            </section>
          )}

          {education && education.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="font-bold text-xs uppercase tracking-[0.2em] text-black">Education</h2>
                <div className="flex-1 h-[1px] bg-slate-200"></div>
              </div>
              <div className="space-y-6">
                {education.map((edu) => (
                  <div key={edu.id} className="space-y-1">
                    <p className="text-[12px] font-bold text-black">{edu.degree}</p>
                    <p className="text-[11px] text-black italic">{edu.institution}</p>
                    <p className="text-[10px] text-black font-bold uppercase tracking-widest">{edu.startDate} - {edu.endDate}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {skills && skills.categories && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="font-bold text-xs uppercase tracking-[0.2em] text-black">Expertise</h2>
                <div className="flex-1 h-[1px] bg-slate-200"></div>
              </div>
              <div className="space-y-4">
                {skills.categories.map((cat) => (
                  cat.list && (
                    <div key={cat.id} className="space-y-2">
                      <span className="text-[11px] text-black font-bold uppercase tracking-wider">{cat.name}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.list.split(',').map((s, i) => (
                          <span key={i} className="text-[10px] bg-white border border-black px-2 py-0.5 rounded text-black">{s.trim()}</span>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </section>
          )}
        </aside>

        {/* Right Column (Main) */}
        <main className="w-[65%] p-10 bg-white space-y-10">
          {/* Contact Info Header in Main */}
          <div className="grid grid-cols-2 gap-6 text-[11px] text-black pb-10 border-b border-black">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-black text-black flex items-center justify-center rounded-lg"><Phone size={14} /></div>
              <span className="font-medium">{personalInfo.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-black text-black flex items-center justify-center rounded-lg"><Mail size={14} /></div>
              <span className="font-medium break-all">{personalInfo.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-black text-black flex items-center justify-center rounded-lg"><MapPin size={14} /></div>
              <span className="font-medium">{personalInfo.location}</span>
            </div>
            {personalInfo.website && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border border-black text-black flex items-center justify-center rounded-lg"><Globe size={14} /></div>
                <span className="font-medium break-all">{personalInfo.website}</span>
              </div>
            )}
          </div>

          <section>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-bold text-lg uppercase tracking-[0.3em] text-black">Experience</h2>
              <div className="flex-1 h-[1.5px] bg-black"></div>
            </div>
            <div className="space-y-12 relative">
              <div className="absolute left-[7px] top-[10px] bottom-[10px] w-[2px] bg-transparent"></div>
              {experience.map((exp) => (
                <div key={exp.id} className="pl-10 relative group">
                  <div className="absolute left-[0.5px] top-[6px] w-[15px] h-[15px] rounded-full border-2 border-black bg-white group-hover:border-blue-500 transition-colors z-10"></div>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="font-bold text-lg text-black leading-tight">{exp.jobTitle}</h3>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-black bg-transparent px-2 py-1 rounded">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <p className="text-[13px] font-bold text-black mb-4 tracking-wide" style={{ color: themeColor }}>{exp.company}</p>
                  <div className="text-[13px] text-black leading-relaxed prose prose-slate max-w-none marker:text-black">
                    <Markdown>{exp.responsibilities}</Markdown>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default DoubleColumn;



