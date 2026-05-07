import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const AutocompleteInput = ({ value, onChange, suggestions, placeholder, label, className }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    if (value && showSuggestions) {
      const matches = suggestions.filter(s => 
        s.toLowerCase().includes(value.toLowerCase()) && 
        s.toLowerCase() !== value.toLowerCase()
      );
      setFiltered(matches.slice(0, 5));
    } else {
      setFiltered([]);
    }
  }, [value, suggestions, showSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && <label className="text-sm font-semibold text-slate-700 mb-2 block">{label}</label>}
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${className}`}
      />
      
      <AnimatePresence>
        {showSuggestions && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden"
          >
            {filtered.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 text-slate-700 transition-colors border-b border-slate-50 last:border-0"
                onClick={() => {
                  onChange(suggestion);
                  setShowSuggestions(false);
                }}
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AutocompleteInput;
