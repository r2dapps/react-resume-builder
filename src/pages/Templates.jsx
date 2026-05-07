import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FileCheck, 
  CheckCircle, 
  Smartphone,
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Layout,
  Briefcase,
  GraduationCap,
  Code,
  FileText,
  MousePointer2,
  ListFilter
} from 'lucide-react';
import { ResumeDocument } from '../components/builder/ResumeDocument';
import { dummyResumeData } from '../constants/dummyData';

const CATEGORIES = [
  { id: 'all', name: 'All templates', icon: Sparkles },
  { id: 'ats', name: 'ATS-friendly', icon: ListFilter },
  { id: 'modern', name: 'Modern', icon: Layout },
  { id: 'professional', name: 'Professional', icon: Briefcase },
  { id: 'simple', name: 'Simple', icon: FileText },
  { id: 'creative', name: 'Creative', icon: MousePointer2 },
  { id: 'academic', name: 'Academic', icon: GraduationCap },
  { id: 'tech', name: 'Technology', icon: Code },
];

export const TEMPLATES = [
  { id: 'modern', name: 'Modern One', description: 'Optimal for tech and creative roles with a balanced, clean layout.', category: 'modern' },
  { id: 'professional', name: 'Professional Blue', description: 'Bold headers and structured layout for high-impact corporate roles.', category: 'professional' },
  { id: 'two-column', name: 'Two-Column Modern', description: 'A sophisticated layout with a dedicated sidebar for skills and education.', category: 'modern' },
  { id: 'minimal', name: 'Minimalist Clean', description: 'Ultra-focus on content with generous whitespace and elegant serif accents.', category: 'simple' },
  { id: 'ats-standard', name: 'ATS Standard', description: 'The gold standard for ATS scanability. Simple, traditional, and effective.', category: 'ats' },
  { id: 'creative', name: 'Creative Playful', description: 'Vibrant and bold design intended for designers, marketers, and creative professionals.', category: 'creative' },
  { id: 'executive', name: 'Executive Classic', description: 'Conservative, high-trust serif layout designed for senior leadership and established professionals.', category: 'professional' },
  { id: 'academic', name: 'Academic / CV', description: 'Classic serif layout optimized for research, teaching, and academic applications.', category: 'academic' },
  { id: 'technology', name: 'Technology Focused', description: 'A bold, technical layout built for software engineers and IT professionals with a strong sidebar stack.', category: 'tech' },
];

const Templates = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const scrollRef = useRef(null);

  const handleSelectTemplate = (templateId) => {
    navigate(`/builder?template=${templateId}`);
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.5 
        : scrollLeft + clientWidth * 0.5;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const filteredTemplates = selectedCategory === 'all' 
    ? TEMPLATES 
    : TEMPLATES.filter(t => t.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden">
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:py-20 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight font-display"
          >
            Pick a <span className="text-blue-600">template</span> and win
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 px-4"
          >
            All our templates are designed to be ATS-expert and easy to read. Move faster with a proven format.
          </motion.p>
        </div>

        {/* Categories Slider */}
        <div className="relative group max-w-5xl mx-auto">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 z-10 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="bg-white rounded-full shadow-lg h-10 w-10 flex items-center justify-center border border-slate-200 hover:bg-slate-50" onClick={() => scroll('left')}>
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 z-10 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="bg-white rounded-full shadow-lg h-10 w-10 flex items-center justify-center border border-slate-200 hover:bg-slate-50" onClick={() => scroll('right')}>
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
          
          <div 
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto pb-4 px-1 no-scrollbar scroll-smooth"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap border transition-all duration-200 text-sm font-medium
                  ${selectedCategory === cat.id 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }
                `}
              >
                <cat.icon className="w-4 h-4" />
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 max-w-5xl mx-auto">
          {filteredTemplates.map((template, idx) => (
            <motion.div 
                key={template.id} 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group flex flex-col items-center bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-2xl hover:border-blue-400 transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => handleSelectTemplate(template.id)}
              >
                <div className="w-full bg-slate-100 flex justify-center items-start overflow-hidden border-b border-slate-100 relative h-[450px] md:h-[500px]">
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 transform scale-[0.35] md:scale-[0.4] origin-top bg-white shadow-2xl pointer-events-none transition-transform group-hover:scale-[0.37] md:group-hover:scale-[0.42]" style={{ width: '800px', minHeight: '1122px' }}>
                        <ResumeDocument data={dummyResumeData} template={template.id} isThumbnail={true} />
                    </div>
                    
                    <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="rounded-full bg-blue-600 text-white px-8 py-3 text-lg font-bold shadow-2xl scale-95 group-hover:scale-100 transition-transform flex items-center gap-2">
                            <FileCheck className="w-6 h-6" />
                            Use Template
                        </div>
                    </div>
                </div>
                
                <div className="p-8 text-center space-y-4 w-full">
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors font-display tracking-tight">{template.name}</h3>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">{template.description}</p>
                  <div className="flex items-center justify-center space-x-4 text-xs font-bold text-slate-400 uppercase tracking-widest pt-2">
                    <span className="flex items-center space-x-1.5"><CheckCircle className="w-4 h-4 text-green-500" /> <span>ATS READY</span></span>
                    <span className="flex items-center space-x-1.5"><Smartphone className="w-4 h-4 text-blue-500" /> <span>MOBILE READY</span></span>
                  </div>
                </div>
             </motion.div>
          ))}
        </div>
      </main>

      <footer className="bg-slate-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">RazelTech</span>
          </div>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Design for professional impact. Speed for career growth. 
            The only builder you need with RazelTech expertise.
          </p>
          <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
             <p>© 2026 RazelTech Inc. All rights reserved.</p>
             <div className="flex gap-6">
               <a href="#" className="hover:text-white transition-colors underline">Privacy Policy</a>
               <a href="#" className="hover:text-white transition-colors underline">Terms of Service</a>
               <a href="#" className="hover:text-white transition-colors underline">Support</a>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Templates;
