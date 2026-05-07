import React from 'react';
import Markdown from 'react-markdown';

const MinimalTemplate = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, themeColor } = data;

  return (
    <div className="p-12 max-w-[800px] mx-auto text-black font-sans leading-snug bg-white" id="minimalist-resume">
      {/* Header - Single Column ATS Style */}
      <header className="mb-8 border-b-2 border-slate-900 pb-4">
        <h1 className="text-3xl font-bold uppercase tracking-tight mb-2 text-black">
          {personalInfo.fullName}
        </h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] font-medium text-black">
          <span className="flex items-center gap-1.5">
            {personalInfo.location}
          </span>
          <span className="text-black">|</span>
          <span className="flex items-center gap-1.5">
            {personalInfo.phone}
          </span>
          <span className="text-black">|</span>
          <span className="flex items-center gap-1.5">
            {personalInfo.email}
          </span>
          {personalInfo.linkedin && (
            <>
              <span className="text-black">|</span>
              <span className="flex items-center gap-1.5">
                {personalInfo.linkedin}
              </span>
            </>
          )}
        </div>
      </header>

      <div className="space-y-6">
        {/* Summary */}
        {summary && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-black mb-2 border-b border-black pb-0.5">
              Professional Summary
            </h2>
            <p className="text-[13px] leading-normal text-black text-justify">
              {summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-black mb-3 border-b border-black pb-0.5">
              Work Experience
            </h2>
            <div className="space-y-5">
              {experience.map((exp) => (
                <div key={exp.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-[14px] font-bold text-black uppercase">
                      {exp.company}
                    </h3>
                    <span className="text-[12px] font-bold text-black italic">
                      {exp.location}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline mb-2">
                    <div className="text-[13px] font-bold text-black italic">
                      {exp.jobTitle}
                    </div>
                    <div className="text-[12px] font-bold text-black tabular-nums">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </div>
                  </div>
                  <div className="text-[13px] text-black prose prose-sm prose-slate max-w-none leading-normal">
                    <Markdown>{exp.responsibilities}</Markdown>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills && skills.categories && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-black mb-2 border-b border-black pb-0.5">
              Key Skills & Core Competencies
            </h2>
            <div className="grid grid-cols-1 gap-y-2">
              {skills.categories.map((cat) => (
                cat.list && (
                  <div key={cat.id} className="text-[13px] flex gap-2">
                    <span className="font-bold text-black shrink-0 uppercase text-[12px] pt-0.5">
                      {cat.name}:
                    </span>
                    <span className="text-black">{cat.list}</span>
                  </div>
                )
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-black mb-3 border-b border-black pb-0.5">
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline text-[13px]">
                  <div>
                    <span className="font-bold text-black uppercase italic">
                      {edu.institution}
                    </span>
                    <span className="mx-2 text-black">•</span>
                    <span className="text-black font-medium">
                      {edu.degree}
                    </span>
                  </div>
                  <div className="text-[12px] font-bold text-black tabular-nums">
                    {edu.startDate} – {edu.endDate}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default MinimalTemplate;



