import React, { useState } from 'react';
import { Upload, FileText, Loader2, Check } from 'lucide-react';
import { extractTextFromPDF, extractTextFromDOCX, parseResumeText } from '../services/resumeParser';

const ImportResume = ({ onImport }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setStatus('loading');
    
    try {
      let text = '';
      if (file.type === 'application/pdf') {
        text = await extractTextFromPDF(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        text = await extractTextFromDOCX(file);
      } else {
        throw new Error('Unsupported file type. Please upload a PDF or DOCX.');
      }

      const parsedData = parseResumeText(text);
      onImport(parsedData);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      alert(err.message || 'Failed to parse resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <label className="relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-slate-50 hover:border-blue-300 transition-all cursor-pointer group">
        <input 
          type="file" 
          className="hidden" 
          accept=".pdf,.docx"
          onChange={handleFileUpload}
          disabled={loading}
        />
        
        {status === 'loading' ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
            <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Parsing Resume...</span>
          </div>
        ) : status === 'success' ? (
          <div className="flex flex-col items-center">
            <Check className="w-10 h-10 text-green-500 mb-2" />
            <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Imported Successfully!</span>
          </div>
        ) : (
          <>
            <div className="bg-white p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform mb-4">
               <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-center">
              <span className="block text-sm font-bold text-slate-900 uppercase tracking-tight">Upload Existing Resume</span>
              <span className="text-xs text-slate-500 font-medium">PDF or DOCX • Smart Data Mapping</span>
            </div>
          </>
        )}
      </label>
    </div>
  );
};

export default ImportResume;
