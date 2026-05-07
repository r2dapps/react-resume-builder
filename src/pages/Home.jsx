import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Rocket, ShieldCheck, Zap, Layers, Smartphone, Download, CheckCircle } from 'lucide-react';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20"
    >
      {/* Hero Section */}
      <div className="text-center mb-20">
        <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest mb-6">
          <CheckCircle className="w-3 h-3" />
          <span>100% Free Forever</span>
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-display font-bold leading-tight text-slate-900 mb-8 max-w-4xl mx-auto tracking-tight">
          Create Professional Resumes <span className="text-blue-600">Without Struggling</span>
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed font-sans">
          Build stunning, ATS-friendly resumes with RazelTech's pro-level tools. Specialized styles for Academic, Tech, and Executive roles—totally free.
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/builder" className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 hover:-translate-y-1 flex items-center justify-center space-x-2">
            <Rocket className="w-4 h-4" />
            <span>Launch Builder</span>
          </Link>
          <Link to="/templates" className="w-full sm:w-auto px-10 py-5 bg-white text-slate-700 border border-slate-100 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center space-x-2 shadow-sm">
            <Layers className="w-4 h-4" />
            <span>Explore Styles</span>
          </Link>
        </motion.div>
        
        <motion.p variants={itemVariants} className="mt-8 text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-center space-x-4">
          <span>✨ No Login Required</span>
          <span className="text-slate-200">•</span>
          <span>✨ PDF & DOCX Export</span>
          <span className="text-slate-200">•</span>
          <span>✨ Unlimited Saves</span>
        </motion.p>
      </div>

      {/* Features Grid */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {[
          { icon: ShieldCheck, title: "100% Free Forever", desc: "No watermarks, no 'premium' features hidden behind paywalls. Just professional tools for your career." },
          { icon: Zap, title: "No Struggle Editor", desc: "Our 'App-like' mobile experience lets you build a powerful resume from your couch or on the go." },
          { icon: Layers, title: "8+ Premium Styles", desc: "From Academic CVs to Tech Stack focus, we have templates designed to pass through ATS systems." },
          { icon: Smartphone, title: "Mobile-First Design", desc: "A sleek, responsive builder with a live-sync preview that works flawlessly on every screen size." },
          { icon: Download, title: "Pro Export Options", desc: "High-resolution PDF for printing and editable DOCX for specific company requirements." },
          { icon: Zap, title: "Fast & Modern", desc: "Built with cutting-edge tech for a lag-free experience. Your data stays private in your browser." }
        ].map((feature, idx) => (
          <motion.div 
            key={idx} 
            variants={itemVariants}
            className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 mb-6 font-bold text-xl">
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-display font-bold mb-3">{feature.title}</h3>
            <p className="text-slate-600 leading-relaxed font-sans">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Home;
