import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useResume } from '../context/ResumeContext';
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Code,
  Plus,
  Trash2,
  Eye,
  Download,
  Upload,
  ChevronRight,
  ChevronLeft,
  MapPin,
  ExternalLink,
  CheckCircle,
  Trophy,
  Loader2,
  Sparkles,
  Info,
  RotateCcw,
  Printer
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import AutocompleteInput from '../components/AutocompleteInput';
import { INITIAL_STATE } from '../context/ResumeContext';
import {
  JOB_TITLES,
  COMPANIES,
  DEGREES,
  INSTITUTIONS,
  SUMMARY_SUGGESTIONS,
  SKILLS_SUGGESTIONS
} from '../constants/suggestions';
import { dummyResumeData } from '../constants/dummyData';
import { downloadPDF, downloadDOCX } from '../services/exportService';
import { ResumeDocument } from '../components/builder/ResumeDocument';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Builder = () => {
  const {
    resumeData,
    updatePersonal,
    updateSummary,
    updateArrayItem,
    addArrayItem,
    removeArrayItem,
    updateSkill,
    setResumeData
  } = useResume();

  const [activeTab, setActiveTab] = useState('personal');
  const [showPreview, setShowPreview] = useState(false);
  const [showExportTip, setShowExportTip] = useState(false);
  const [pendingExport, setPendingExport] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const formContainerRef = useRef(null);

  // Auto-scroll to top when tab changes
  useEffect(() => {
    if (formContainerRef.current) {
      // Use requestAnimationFrame to ensure the DOM has updated and the new height is calculated
      requestAnimationFrame(() => {
        if (formContainerRef.current) {
          formContainerRef.current.scrollTop = 0;
        }
      });
    }
  }, [activeTab]);

  const resetForm = () => {
    if (window.confirm('Are you sure you want to clear all form data? This action cannot be undone.')) {
      setResumeData({
        ...INITIAL_STATE,
        template: resumeData.template,
        themeColor: resumeData.themeColor
      });
      setActiveTab('personal');

      const fileInput = document.getElementById('resume-upload');
      if (fileInput) fileInput.value = '';
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'projects', label: 'Projects', icon: ExternalLink },
    { id: 'others', label: 'Others', icon: Trophy },
  ];

  const handleImport = (data) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...data.personalInfo },
      summary: data.summary || prev.summary,
      skills: data.skills.categories[0].list ? data.skills : prev.skills
    }));
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const fileName = `${resumeData.personalInfo.fullName || 'resume'}_${resumeData.template}.pdf`;
      await downloadPDF(resumeData, fileName);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportDOCX = async () => {
    await downloadDOCX(resumeData, `${resumeData.personalInfo.fullName || 'resume'}.docx`);
  };

  const loadSampleData = () => {
    if (window.confirm('This will replace your current data with sample information. Continue?')) {
      setResumeData(dummyResumeData);
      setActiveTab('personal');
    }
  };

  const nextTab = () => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1].id);
  };

  const prevTab = () => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1].id);
  };

  return (
    <div className="builder-layout bg-white flex flex-col md:flex-row h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] overflow-hidden relative">
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          @page { size: A4; margin: 0; }
          body, html { margin: 0 !important; padding: 0 !important; background: white !important; }
          /* Hide everything except the print container */
          body > *:not(#root) { display: none !important; }
          .builder-layout { display: block !important; height: auto !important; margin: 0 !important; padding: 0 !important; overflow: visible !important; }
          .no-print, .preview-controls, nav, footer, button, .builder-layout > div:first-child { display: none !important; }
          .builder-layout > div:last-child { display: block !important; width: 100% !important; margin: 0 !important; padding: 0 !important; overflow: visible !important; }
          .print-paper-container { 
            display: block !important; 
            overflow: visible !important; 
            height: auto !important; 
            padding: 0 !important; 
            margin: 0 !important;
            background: white !important; 
          }
          #resume-preview { 
            position: relative !important;
            width: 210mm !important; 
            min-height: 297mm !important; 
            margin: 0 !important; 
            padding: 0 !important; 
            transform: none !important;
            box-shadow: none !important; 
            border: none !important; 
            display: block !important; 
          }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-shadow: none !important; }
        }
      `}} />
      {/* Sidebar Form */}
      <div className={cn(
        "flex flex-col border-r border-slate-200 h-full overflow-hidden transition-all duration-300 no-print",
        showPreview ? "hidden lg:flex lg:flex-1" : "flex flex-1"
      )}>
        {/* Mobile Sticky Header for Editor */}
        <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-100 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-50 flex justify-center">
            <div className="bg-slate-200/50 p-1.5 rounded-2xl flex w-full max-w-sm">
              <button
                onClick={() => setShowPreview(false)}
                className={cn(
                  "flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  !showPreview ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"
                )}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Editor</span>
              </button>
              <button
                onClick={() => setShowPreview(true)}
                className={cn(
                  "flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  showPreview ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"
                )}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            </div>
          </div>

          <div className="px-4 py-3 border-b border-slate-50 bg-white">
            <header className="p-1.5 bg-slate-100/50 rounded-2xl flex items-center justify-between w-full max-w-sm mx-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-11 h-11 flex items-center justify-center rounded-xl transition-all",
                      isActive
                        ? "bg-white text-blue-600 shadow-sm border border-slate-100"
                        : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                );
              })}
            </header>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          {/* Desktop Only Icons Header */}
          <div className="hidden lg:block px-10 pt-10 pb-6 border-b border-slate-50 bg-white z-10 w-full shrink-0">
            <header className="p-1 bg-slate-100/80 backdrop-blur-sm rounded-xl inline-flex w-full">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex-1 flex items-center justify-center space-x-2 py-2.5 px-1 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all",
                      isActive
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    <Icon className={cn("w-3.5 h-3.5", isActive ? "text-blue-600" : "text-slate-400")} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </header>
          </div>

          <div
            ref={formContainerRef}
            className="flex-1 overflow-y-auto px-6 md:px-10 py-8 no-scrollbar"
          >
            <AnimatePresence initial={false}>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="max-w-2xl mx-auto"
              >
                {activeTab === 'personal' && (
                  <div className="space-y-8">
                    <header>
                      <h2 className="text-2xl font-display font-bold text-slate-900 leading-none">Personal Details</h2>
                      <p className="text-slate-500 mt-2 text-sm font-sans">Essential contact information for recruiters</p>
                    </header>

                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <div className="flex-1 flex flex-col justify-center p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/30 hover:bg-white hover:border-blue-400 transition-all group relative">
                        <input
                          type="file"
                          id="resume-upload"
                          className="hidden"
                          accept=".pdf,.docx"
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const { extractTextFromPDF, extractTextFromDOCX, parseResumeText } = await import('../services/resumeParser');
                            try {
                              let text = '';
                              if (file.type === 'application/pdf') text = await extractTextFromPDF(file);
                              else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') text = await extractTextFromDOCX(file);
                              const parsedData = parseResumeText(text);
                              handleImport(parsedData);
                            } catch (err) {
                              alert(err.message);
                            }
                          }}
                        />
                        <label htmlFor="resume-upload" className="cursor-pointer flex items-center space-x-4">
                          <div className="bg-white p-2.5 rounded-lg shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <Upload className="w-5 h-5 text-blue-600 group-hover:text-white" />
                          </div>
                          <div>
                            <span className="block text-sm font-bold text-slate-900 uppercase tracking-tight">Import Resume</span>
                            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">PDF or DOCX</span>
                          </div>
                        </label>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={loadSampleData}
                          className="flex flex-col items-center justify-center px-4 py-2 bg-blue-50/50 border-2 border-dashed border-blue-100 rounded-xl hover:bg-white hover:border-blue-400 transition-all group shrink-0"
                          title="Load Sample Data"
                        >
                          <Sparkles className="w-4 h-4 text-blue-600 mb-1 group-hover:scale-125 transition-transform" />
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">Sample</span>
                        </button>

                        <button
                          onClick={resetForm}
                          className="flex flex-col items-center justify-center px-4 py-2 bg-red-50/50 border-2 border-dashed border-red-100 rounded-xl hover:bg-white hover:border-red-400 transition-all group shrink-0"
                          title="Reset Forms"
                        >
                          <RotateCcw className="w-4 h-4 text-red-500 mb-1 group-hover:rotate-180 transition-transform duration-500" />
                          <span className="text-[10px] font-bold text-red-600 uppercase tracking-tight">Reset</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="text-sm font-semibold text-slate-700 mb-2 block">Full Name</label>
                        <input
                          type="text"
                          value={resumeData.personalInfo.fullName}
                          onChange={(e) => updatePersonal('fullName', e.target.value)}
                          placeholder="e.g. Rajesh Kumar"
                          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>

                      <AutocompleteInput
                        label="Desired Job Title"
                        value={resumeData.personalInfo.jobTitle}
                        onChange={(val) => updatePersonal('jobTitle', val)}
                        suggestions={JOB_TITLES}
                        placeholder="e.g. Senior Software Engineer"
                      />

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Email Address</label>
                        <input
                          type="email"
                          value={resumeData.personalInfo.email}
                          onChange={(e) => updatePersonal('email', e.target.value)}
                          placeholder="e.g. rajesh@example.com"
                          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                        <input
                          type="tel"
                          value={resumeData.personalInfo.phone}
                          onChange={(e) => updatePersonal('phone', e.target.value)}
                          placeholder="e.g. +91 9876543210"
                          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Location</label>
                        <input
                          type="text"
                          value={resumeData.personalInfo.location}
                          onChange={(e) => updatePersonal('location', e.target.value)}
                          placeholder="e.g. Bangalore, India"
                          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">LinkedIn URL</label>
                        <input
                          type="url"
                          value={resumeData.personalInfo.linkedin}
                          onChange={(e) => updatePersonal('linkedin', e.target.value)}
                          placeholder="linkedin.com/in/username"
                          className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Website / Portfolio</label>
                        <input
                          type="url"
                          value={resumeData.personalInfo.website}
                          onChange={(e) => updatePersonal('website', e.target.value)}
                          placeholder="portfolio-link.com"
                          className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'summary' && (
                  <div className="space-y-8">
                    <header>
                      <h2 className="text-3xl font-display font-bold text-slate-900 leading-none">Professional Summary</h2>
                      <p className="text-slate-500 mt-2 font-sans">Showcase your value proposition in 2-3 powerful sentences</p>
                    </header>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold text-slate-700">Write Summary</label>
                        <div className="group relative">
                          <button className="text-blue-600 text-xs font-bold flex items-center space-x-1 hover:text-blue-700">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>VIEW SUGGESTIONS</span>
                          </button>
                          <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl p-4 hidden group-hover:block z-50">
                            <h4 className="text-xs font-bold text-slate-900 mb-3 border-b pb-2 uppercase tracking-widest">Summary Examples</h4>
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 no-scrollbar">
                              {SUMMARY_SUGGESTIONS.map((s, i) => (
                                <button
                                  key={i}
                                  onClick={() => updateSummary(s)}
                                  className="text-left text-[11px] text-slate-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg border border-transparent hover:border-blue-100 transition-all block w-full"
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <textarea
                        rows={10}
                        value={resumeData.summary}
                        onChange={(e) => updateSummary(e.target.value)}
                        placeholder="Write 2-4 lines about your career achievements and goals..."
                        className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none font-sans leading-relaxed text-slate-700"
                      />
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-bold mb-1">ATS Tip:</p>
                          <p>Include keywords relevant to your target job role. Avoid using too many clichés like "highly motivated" or "passionate".</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'experience' && (
                  <div className="space-y-8">
                    <header className="flex items-center justify-between">
                      <div>
                        <h2 className="text-3xl font-display font-bold text-slate-900 leading-none">Work Experience</h2>
                        <p className="text-slate-500 mt-2 font-sans">List your professional journey in reverse chronological order</p>
                      </div>
                      <button
                        onClick={() => addArrayItem('experience', { jobTitle: '', company: '', location: '', startDate: '', endDate: '', current: false, responsibilities: '' })}
                        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </header>

                    <div className="space-y-10">
                      {resumeData.experience.map((exp) => (
                        <div key={exp.id} className="relative group p-6 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all">
                          <button
                            onClick={() => removeArrayItem('experience', exp.id)}
                            className="absolute -top-3 -right-3 bg-white text-red-500 p-2 rounded-full shadow-md hover:bg-red-50 transition-colors border border-slate-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AutocompleteInput
                              label="Job Title"
                              value={exp.jobTitle}
                              onChange={(val) => updateArrayItem('experience', exp.id, 'jobTitle', val)}
                              suggestions={JOB_TITLES}
                              placeholder="e.g. Software Engineer"
                            />
                            <AutocompleteInput
                              label="Company Name"
                              value={exp.company}
                              onChange={(val) => updateArrayItem('experience', exp.id, 'company', val)}
                              suggestions={COMPANIES}
                              placeholder="e.g. Google"
                            />
                            <div className="space-y-2">
                              <label className="text-sm font-semibold text-slate-700">Start Date</label>
                              <input type="text" value={exp.startDate} onChange={(e) => updateArrayItem('experience', exp.id, 'startDate', e.target.value)} placeholder="MM/YYYY" className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-semibold text-slate-700">End Date</label>
                              <input disabled={exp.current} type="text" value={exp.endDate} onChange={(e) => updateArrayItem('experience', exp.id, 'endDate', e.target.value)} placeholder="MM/YYYY or Present" className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none" />
                            </div>
                            <div className="md:col-span-2">
                              <label className="text-sm font-semibold text-slate-700 mb-2 block">Responsibilities & Achievements</label>
                              <textarea
                                rows={5}
                                value={exp.responsibilities}
                                onChange={(e) => updateArrayItem('experience', exp.id, 'responsibilities', e.target.value)}
                                placeholder="Describe your key tasks and quantifiable accomplishments..."
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none font-sans"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'education' && (
                  <div className="space-y-8">
                    <header className="flex items-center justify-between">
                      <div>
                        <h2 className="text-3xl font-display font-bold text-slate-900 leading-none">Education</h2>
                        <p className="text-slate-500 mt-2 font-sans">Showcase your academic credentials</p>
                      </div>
                      <button onClick={() => addArrayItem('education', { degree: '', institution: '', location: '', startDate: '', endDate: '', gpa: '' })} className="bg-blue-600 text-white p-2 rounded-full shadow-lg"><Plus className="w-5 h-5" /></button>
                    </header>

                    <div className="space-y-8">
                      {resumeData.education.map((edu) => (
                        <div key={edu.id} className="relative p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                          <button onClick={() => removeArrayItem('education', edu.id)} className="absolute -top-3 -right-3 bg-white text-red-500 p-2 rounded-full shadow-md border border-slate-100"><Trash2 className="w-4 h-4" /></button>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AutocompleteInput label="Degree / Course" value={edu.degree} onChange={(val) => updateArrayItem('education', edu.id, 'degree', val)} suggestions={DEGREES} placeholder="e.g. B.Tech in CS" />
                            <AutocompleteInput label="Institution" value={edu.institution} onChange={(val) => updateArrayItem('education', edu.id, 'institution', val)} suggestions={INSTITUTIONS} placeholder="e.g. IIT Delhi" />
                            <div className="space-y-2">
                              <label className="text-sm font-semibold text-slate-700">Start Date</label>
                              <input type="text" value={edu.startDate} onChange={(e) => updateArrayItem('education', edu.id, 'startDate', e.target.value)} placeholder="MM/YYYY" className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-semibold text-slate-700">End Date</label>
                              <input type="text" value={edu.endDate} onChange={(e) => updateArrayItem('education', edu.id, 'endDate', e.target.value)} placeholder="MM/YYYY" className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'skills' && (
                  <div className="space-y-8">
                    <header className="flex items-center justify-between">
                      <div>
                        <h2 className="text-3xl font-display font-bold text-slate-900 leading-none">Skills Inventory</h2>
                        <p className="text-slate-500 mt-2 font-sans">Organize your expertise into searchable categories</p>
                      </div>
                      <button
                        onClick={() => {
                          const id = Date.now().toString();
                          setResumeData(prev => ({
                            ...prev,
                            skills: {
                              ...prev.skills,
                              categories: [...prev.skills.categories, { id, name: 'New Category', list: '' }]
                            }
                          }));
                        }}
                        className="bg-blue-600 text-white p-2 rounded-full shadow-lg"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </header>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8">
                      <div className="flex items-center space-x-2 text-slate-700 mb-4 font-bold text-sm uppercase tracking-wider">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <span>Quick Add Popular Skills</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {SKILLS_SUGGESTIONS.slice(0, 20).map(skill => (
                          <button
                            key={skill}
                            onClick={() => {
                              const lastCat = resumeData.skills.categories[resumeData.skills.categories.length - 1];
                              if (!lastCat.list.includes(skill)) {
                                const newList = lastCat.list ? `${lastCat.list}, ${skill}` : skill;
                                updateSkill(lastCat.id, 'list', newList);
                              }
                            }}
                            className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-all"
                          >
                            + {skill}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-8">
                      {resumeData.skills.categories.map((cat) => (
                        <div key={cat.id} className="relative p-6 bg-slate-50/50 rounded-2xl border border-slate-100 group">
                          {resumeData.skills.categories.length > 1 && (
                            <button
                              onClick={() => {
                                setResumeData(prev => ({
                                  ...prev,
                                  skills: {
                                    ...prev.skills,
                                    categories: prev.skills.categories.filter(c => c.id !== cat.id)
                                  }
                                }));
                              }}
                              className="absolute -top-3 -right-3 bg-white text-red-500 p-2 rounded-full shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          <div className="space-y-4">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category Name</label>
                            <input
                              type="text"
                              value={cat.name}
                              onChange={(e) => updateSkill(cat.id, 'name', e.target.value)}
                              className="w-full text-lg font-display font-bold bg-transparent border-b border-slate-100 outline-none focus:border-blue-500 text-slate-800 pb-1"
                            />
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Skills (Comma Separated)</label>
                              <textarea
                                rows={3}
                                value={cat.list}
                                onChange={(e) => updateSkill(cat.id, 'list', e.target.value)}
                                placeholder="e.g. JavaScript, React, Node.js, TypeScript..."
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none transition-all resize-none font-sans bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'projects' && (
                  <div className="space-y-8">
                    <header className="flex items-center justify-between">
                      <div>
                        <h2 className="text-3xl font-display font-bold text-slate-900 leading-none">Personal Projects</h2>
                        <p className="text-slate-500 mt-2 font-sans">Demonstrate your skills with real-world applications</p>
                      </div>
                      <button onClick={() => addArrayItem('projects', { name: '', technologies: '', description: '', link: '' })} className="bg-blue-600 text-white p-2 rounded-full shadow-lg"><Plus className="w-5 h-5" /></button>
                    </header>
                    <div className="space-y-8">
                      {resumeData.projects.map((proj) => (
                        <div key={proj.id} className="relative p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                          <button onClick={() => removeArrayItem('projects', proj.id)} className="absolute -top-3 -right-3 bg-white text-red-500 p-2 rounded-full shadow-md border border-slate-100"><Trash2 className="w-4 h-4" /></button>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                              <label className="text-sm font-semibold text-slate-700">Project Name</label>
                              <input type="text" value={proj.name} onChange={(e) => updateArrayItem('projects', proj.id, 'name', e.target.value)} placeholder="e.g. E-commerce Website" className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <label className="text-sm font-semibold text-slate-700">Technologies Used</label>
                              <input type="text" value={proj.technologies} onChange={(e) => updateArrayItem('projects', proj.id, 'technologies', e.target.value)} placeholder="e.g. React, Firebase, Stripe" className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <label className="text-sm font-semibold text-slate-700">Project Description</label>
                              <textarea rows={3} value={proj.description} onChange={(e) => updateArrayItem('projects', proj.id, 'description', e.target.value)} placeholder="Describe what the project does and your role..." className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none resize-none font-sans" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'others' && (
                  <div className="space-y-8">
                    <header>
                      <h2 className="text-3xl font-display font-bold text-slate-900 leading-none">Certifications & Others</h2>
                      <p className="text-slate-500 mt-2 font-sans">Additional achievements to make you stand out</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="md:col-span-2 space-y-4">
                        <label className="text-sm font-semibold text-slate-700">Certifications</label>
                        {resumeData.certifications.map((cert) => (
                          <div key={cert.id} className="flex space-x-2">
                            <input type="text" value={cert.name} onChange={(e) => updateArrayItem('certifications', cert.id, 'name', e.target.value)} placeholder="Certification Name" className="flex-1 px-4 py-2 rounded-lg border border-slate-200 outline-none" />
                            <button onClick={() => removeArrayItem('certifications', cert.id)} className="text-red-500 p-2 text-xs font-bold">REMOVE</button>
                          </div>
                        ))}
                        <button onClick={() => addArrayItem('certifications', { name: '', organization: '', date: '' })} className="text-xs font-bold text-blue-600 flex items-center space-x-1"><Plus className="w-3.5 h-3.5" /> <span>ADD CERTIFICATION</span></button>
                      </div>

                      <div className="md:col-span-2 space-y-4">
                        <label className="text-sm font-semibold text-slate-700">Honors & Awards</label>
                        {resumeData.awards.map((award) => (
                          <div key={award.id} className="flex space-x-2">
                            <input type="text" value={award.title} onChange={(e) => updateArrayItem('awards', award.id, 'title', e.target.value)} placeholder="Award Title" className="flex-1 px-4 py-2 rounded-lg border border-slate-200 outline-none" />
                            <button onClick={() => removeArrayItem('awards', award.id)} className="text-red-500 p-2 text-xs font-bold">REMOVE</button>
                          </div>
                        ))}
                        <button onClick={() => addArrayItem('awards', { title: '', issuer: '', date: '' })} className="text-xs font-bold text-blue-600 flex items-center space-x-1"><Plus className="w-3.5 h-3.5" /> <span>ADD AWARD</span></button>
                      </div>

                      <div className="md:col-span-2 space-y-4">
                        <label className="text-sm font-semibold text-slate-700">Languages</label>
                        {resumeData.languages.map((lang) => (
                          <div key={lang.id} className="flex space-x-2">
                            <input type="text" value={lang.name} onChange={(e) => updateArrayItem('languages', lang.id, 'name', e.target.value)} placeholder="Language" className="flex-1 px-4 py-2 rounded-lg border border-slate-200 outline-none" />
                            <input type="text" value={lang.proficiency} onChange={(e) => updateArrayItem('languages', lang.id, 'proficiency', e.target.value)} placeholder="Proficiency (e.g. Native)" className="w-40 px-4 py-2 rounded-lg border border-slate-200 outline-none" />
                            <button onClick={() => removeArrayItem('languages', lang.id)} className="text-red-500 p-2 text-xs font-bold">REMOVE</button>
                          </div>
                        ))}
                        <button onClick={() => addArrayItem('languages', { name: '', proficiency: '' })} className="text-xs font-bold text-blue-600 flex items-center space-x-1"><Plus className="w-3.5 h-3.5" /> <span>ADD LANGUAGE</span></button>
                      </div>

                      <div className="md:col-span-1 space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Key Strengths</label>
                        <textarea
                          rows={3}
                          value={resumeData.strengths}
                          onChange={(e) => setResumeData(prev => ({ ...prev, strengths: e.target.value }))}
                          placeholder="e.g. Leadership, Team Management..."
                          className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none resize-none"
                        />
                      </div>

                      <div className="md:col-span-1 space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Interests</label>
                        <textarea
                          rows={3}
                          value={resumeData.interests}
                          onChange={(e) => setResumeData(prev => ({ ...prev, interests: e.target.value }))}
                          placeholder="e.g. Photography, Travelling..."
                          className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="border-t border-slate-100 p-4 lg:p-6 flex items-center justify-between bg-white shrink-0 z-40 no-print">
            <button
              onClick={prevTab}
              disabled={activeTab === 'personal'}
              className="flex items-center space-x-2 text-slate-400 hover:text-slate-900 font-black uppercase text-[10px] tracking-widest disabled:opacity-30 disabled:cursor-not-allowed py-4 px-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>PREVIOUS</span>
            </button>

            <button
              onClick={nextTab}
              disabled={activeTab === 'others'}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-black uppercase text-[10px] tracking-widest disabled:opacity-0 py-4 px-2"
            >
              <span>NEXT SECTION</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Live Preview Pane */}
      <div className={cn(
        "bg-slate-100 flex-col h-full overflow-hidden relative",
        showPreview ? "flex flex-1 lg:relative lg:z-0" : "hidden lg:flex lg:flex-1"
      )}>
        {/* Preview Controls - Should be hidden during print */}
        <div className="preview-controls no-print">
          {/* Preview Header for Mobile */}
          <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-100 flex flex-col shrink-0">
            <div className="p-3 border-b border-slate-50 flex justify-center sticky top-0 bg-white">
              <div className="bg-slate-200/50 p-1.5 rounded-2xl flex w-full max-w-sm">
                <button
                  onClick={() => setShowPreview(false)}
                  className={cn(
                    "flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    !showPreview ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"
                  )}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Editor</span>
                </button>
                <button
                  onClick={() => setShowPreview(true)}
                  className={cn(
                    "flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    showPreview ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"
                  )}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              </div>
            </div>
          </div>

          {/* Preview Controls (Desktop/Shared) */}
          <div className="px-6 py-8 flex flex-col gap-6 bg-white border-b border-slate-100 shrink-0">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center space-x-4">
                  <label className="text-[10px] font-black text-[#0078ff] uppercase tracking-widest shrink-0">Template</label>
                  <select
                    value={resumeData.template}
                    onChange={(e) => setResumeData(prev => ({ ...prev, template: e.target.value }))}
                    className="bg-slate-50/50 border border-slate-100 text-[11px] font-black text-slate-700 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px] shadow-sm appearance-none cursor-pointer hover:border-blue-200 transition-colors uppercase tracking-wider"
                  >
                    <option value="modern">Modern One</option>
                    <option value="professional">Professional Blue</option>
                    <option value="two-column">Two-Column Modern</option>
                    <option value="minimal">Minimalist Clean</option>
                    <option value="ats-standard">ATS Standard</option>
                    <option value="creative">Creative Playful</option>
                    <option value="executive">Executive Classic</option>
                    <option value="academic">Academic / CV</option>
                    <option value="technology">Technology Focused</option>
                  </select>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="text-[10px] font-black text-[#0078ff] uppercase tracking-widest shrink-0">Color</label>
                  <div className="flex items-center space-x-2 bg-slate-50/50 p-1.5 rounded-xl border border-slate-50">
                    {['#2563eb', '#000000', '#52c69d', '#f87171', '#fbbf24', '#a78bfa'].map(color => (
                      <button
                        key={color}
                        onClick={() => setResumeData(prev => ({ ...prev, themeColor: color }))}
                        className={cn(
                          "w-7 h-7 rounded-lg transition-all relative flex items-center justify-center",
                          resumeData.themeColor === color ? "scale-105 shadow-md shadow-black/10" : "hover:scale-110"
                        )}
                        style={{ backgroundColor: color }}
                      >
                        {resumeData.themeColor === color && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-center gap-2 pt-4 border-t border-slate-50">
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-white border border-slate-100 text-slate-500 h-14 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 flex items-center justify-center space-x-2 transition-all shadow-sm group"
                >
                  <Printer className="w-4 h-4 text-slate-400" />
                  <span>PRINT</span>
                </button>

                <button
                  onClick={() => {
                    setPendingExport('pdf');
                    setShowExportTip(true);
                  }}
                  disabled={isExporting}
                  className="flex-1 bg-[#0f172a] text-white h-14 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 shadow-xl"
                >
                  {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                  <span>PDF</span>
                </button>

                <button
                  onClick={() => {
                    setPendingExport('docx');
                    setShowExportTip(true);
                  }}
                  className="flex-1 bg-[#2563eb] text-white h-14 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 flex items-center justify-center space-x-2 transition-all shadow-xl shadow-blue-500/20"
                >
                  <Download className="w-4 h-4" />
                  <span>DOCX</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Paper Container */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-12 flex justify-center bg-slate-100 no-scrollbar print-paper-container">
          <div id="resume-preview" className="bg-white shadow-2xl w-full max-w-[210mm] min-h-[297mm] h-fit origin-top transform scale-[0.55] sm:scale-75 md:scale-90 lg:scale-100 transition-all font-sans relative flex flex-col">
            <ResumeDocument data={resumeData} template={resumeData.template} />
          </div>
        </div>
      </div>

      {/* Export Tip Modal */}
      {showExportTip && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-100"
          >
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900 text-center mb-2 uppercase tracking-tight">Industry Pro-Tip</h3>
            <p className="text-sm text-slate-500 text-center mb-8 leading-relaxed font-medium">
              For maximum ATS score, we recommend using the <span className="text-blue-600 font-bold">PRINT</span> button directly and selecting "Save as PDF". This preserves 100% selectable text which is critical for resume scanning systems.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowExportTip(false);
                  setPendingExport(null);
                }}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setShowExportTip(false);
                  if (pendingExport === 'pdf') {
                    await handleExportPDF();
                  } else if (pendingExport === 'docx') {
                    await handleExportDOCX();
                  }
                  setPendingExport(null);
                }}
                className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex justify-center items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Builder;
