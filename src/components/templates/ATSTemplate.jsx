import React from 'react';
import Markdown from 'react-markdown';

const ATSTemplate = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, themeColor } = data;

  return (
    <div className="p-12 font-serif text-black leading-tight max-w-[800px] mx-auto bg-white shadow-sm my-10">
      <header className="text-center mb-8 border-b-2 border-slate-900 pb-6">
        <h1 className="text-4xl font-bold uppercase mb-2 tracking-tight">{personalInfo.fullName}</h1>
        <div className="text-sm space-x-2">
          <span>{personalInfo.location}</span>
          <span>|</span>
          <span>{personalInfo.phone}</span>
          <span>|</span>
          <span>{personalInfo.email}</span>
          {personalInfo.linkedin && (
            <>
              <span>|</span>
              <span>{personalInfo.linkedin}</span>
            </>
          )}
        </div>
      </header>

      <div className="space-y-8">
        {summary && (
          <section>
            <h2 className="text-[14px] font-bold uppercase border-b border-black mb-3 pb-0.5 tracking-wider">Professional Summary</h2>
            <p className="text-[13px] leading-normal text-justify">{summary}</p>
          </section>
        )}

        {skills && skills.categories && (
          <section>
            <h2 className="text-[14px] font-bold uppercase border-b border-black mb-3 pb-0.5 tracking-wider">Core Competencies</h2>
            <div className="grid grid-cols-2 gap-x-12 gap-y-1.5">
              {skills.categories.map((cat) => (
                cat.list && (
                  <div key={cat.id} className="text-[12px] flex items-start gap-2">
                    <span className="font-bold whitespace-nowrap">{cat.name}:</span>
                    <span className="opacity-100">{cat.list}</span>
                  </div>
                )
              ))}
            </div>
          </section>
        )}

        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-[14px] font-bold uppercase border-b border-black mb-4 pb-0.5 tracking-wider">Professional Experience</h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="break-inside-avoid">
                  <div className="flex justify-between font-bold text-[13px] mb-1">
                    <span className="uppercase">{exp.company}</span>
                    <span>{exp.location}</span>
                  </div>
                  <div className="flex justify-between italic text-[13px] mb-3">
                    <span>{exp.jobTitle}</span>
                    <span>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <div className="text-[12px] prose prose-sm prose-slate max-w-none marker:text-black leading-relaxed">
                    <Markdown>{exp.responsibilities}</Markdown>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {education && education.length > 0 && (
          <section>
            <h2 className="text-[14px] font-bold uppercase border-b border-black mb-3 pb-0.5 tracking-wider">Education</h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between text-[13px] items-baseline">
                  <div>
                    <span className="font-bold">{edu.institution}</span>
                    <span className="mx-2">•</span>
                    <span className="italic">{edu.degree}</span>
                  </div>
                  <div className="font-bold tabular-nums text-xs">{edu.startDate} – {edu.endDate}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ATSTemplate;



