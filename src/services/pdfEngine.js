import { jsPDF } from 'jspdf';
import { renderTemplate } from './pdfTemplates';

// A4 page constants (mm)
export const A4 = { w: 210, h: 297, m: 15 };

// Convert hex to [r,g,b]
export const hexRgb = (hex) => {
  const h = hex.replace('#','');
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
};

// Core drawing helpers passed to every template renderer
export const makeCtx = (doc, data) => {
  const tc = data.themeColor || '#2563eb';
  const tcRgb = hexRgb(tc);
  const isSerif = ['academic','executive','ats-standard'].includes(data.template);
  const font = isSerif ? 'times' : 'helvetica';

  return {
    doc, data, tc, tcRgb, font,
    A4,
    // Color helpers
    setTC:   (hex) => { const [r,g,b]=hexRgb(hex); doc.setTextColor(r,g,b); },
    setDC:   (hex) => { const [r,g,b]=hexRgb(hex); doc.setDrawColor(r,g,b); },
    setFC:   (hex) => { const [r,g,b]=hexRgb(hex); doc.setFillColor(r,g,b); },
    setTCTheme: () => { doc.setTextColor(...hexRgb(tc)); },
    setDCTheme: () => { doc.setDrawColor(...hexRgb(tc)); },
    setFCTheme: () => { doc.setFillColor(...hexRgb(tc)); },
    // Text
    wrap: (text, w) => doc.splitTextToSize(text || '', w),
    // Page break - returns true if page was added
    chk: (y, need) => {
      if (y + need > A4.h - A4.m) { doc.addPage(); return true; }
      return false;
    },
  };
};

export const generatePurePDF = (resumeData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const ctx = makeCtx(doc, resumeData);
      renderTemplate(ctx);
      resolve(doc);
    } catch (err) {
      console.error('PDF generation error:', err);
      reject(err);
    }
  });
};
