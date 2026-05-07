export const renderTemplate = (ctx) => {
  const { doc, data, font, A4, setTC, setFC, setDC, setTCTheme, setFCTheme, setDCTheme, wrap, chk } = ctx;
  const m = A4.m;
  const pw = A4.w;
  const ph = A4.h;
  const cw = pw - m * 2;
  const template = data.template || 'modern';

  // Tailwind Slate Palette mappings (Darkened for Print)
  const tw = {
    slate50: '#f1f5f9', // darkened from f8fafc
    slate100: '#e2e8f0', // darkened from f1f5f9
    slate200: '#cbd5e1', // darkened from e2e8f0
    slate300: '#94a3b8',
    slate400: '#475569', // Was 94a3b8, now using slate-600 hex for high contrast
    slate500: '#334155', // Was 64748b, now using slate-700
    slate600: '#1e293b', // Was 475569, now using slate-800
    slate700: '#0f172a', // Was 334155, now using slate-900
    slate800: '#000000', // Was 1e293b, now black
    slate900: '#000000', // Was 0f172a, now black
    white: '#ffffff',
    black: '#000000'
  };

  // --- PRIMITIVES ---
  const Title = (txt, x, y, opts = {}) => {
    if (!txt) return;
    doc.setFont(font, opts.bold ? 'bold' : (opts.italic ? 'italic' : 'normal'));
    doc.setFontSize(opts.size || 12);
    if (opts.color === 'theme') setTCTheme();
    else if (opts.color) setTC(opts.color);
    else setTC(tw.slate900);
    doc.text(txt, x, y, { align: opts.align || 'left' });
  };

  const Text = (txt, x, y, w, opts = {}) => {
    if (!txt) return 0;
    doc.setFont(font, opts.bold ? 'bold' : (opts.italic ? 'italic' : 'normal'));
    doc.setFontSize(opts.size || 10);
    if (opts.color === 'theme') setTCTheme();
    else if (opts.color) setTC(opts.color);
    else setTC(tw.slate600);
    const lines = wrap(txt, w);
    doc.text(lines, x, y, { align: opts.align || 'left' });
    return lines.length * (opts.lh || 4.5);
  };

  const Line = (x1, y1, x2, y2, opts = {}) => {
    if (opts.color === 'theme') setDCTheme();
    else if (opts.color) setDC(opts.color);
    doc.setLineWidth(opts.width || 0.5);
    doc.line(x1, y1, x2, y2);
  };

  const Rect = (x, y, w, h, opts = {}) => {
    if (opts.color === 'theme') setFCTheme();
    else if (opts.color) setFC(opts.color);
    doc.rect(x, y, w, h, 'F');
  };

  const Circle = (x, y, r, opts = {}) => {
    if (opts.color === 'theme') setFCTheme();
    else if (opts.color) setFC(opts.color);
    doc.circle(x, y, r, 'F');
    if (opts.border) {
      if (opts.borderColor === 'theme') setDCTheme();
      else if (opts.borderColor) setDC(opts.borderColor);
      doc.setLineWidth(opts.borderWidth || 0.5);
      doc.circle(x, y, r, 'S');
    }
  };

  // Vector Icons replacing Emojis
  const DrawIcon = (type, x, y, size = 3, color = tw.slate400) => {
    setDC(color); setFC(color);
    doc.setLineWidth(0.4);
    if (type === 'email') {
      doc.rect(x - size, y - size/1.5, size*2, size*1.5, 'S');
      doc.line(x - size, y - size/1.5, x, y);
      doc.line(x + size, y - size/1.5, x, y);
    } else if (type === 'phone') {
      doc.rect(x - size/1.5, y - size, size*1.5, size*2, 'S');
      doc.circle(x, y + size/1.5, 0.5, 'F');
    } else if (type === 'location') {
      doc.circle(x, y - size/2, size/1.5, 'S');
      doc.line(x, y + size/3, x, y + size);
    } else if (type === 'link') {
      doc.circle(x - size/2, y, size/1.5, 'S');
      doc.circle(x + size/2, y, size/1.5, 'S');
    }
  };

  // --- SECTIONS ---
  const renderExperience = (x, y, w, style = 'plain') => {
    if (!data.experience || !data.experience.length) return y;
    let cy = y;
    
    if (style === 'professional') {
      Title('Professional Experience', x + 5, cy, { size: 10, bold: true, color: tw.slate400 });
      Rect(x, cy - 2, 3, 0.5, { color: 'theme' }); // Tiny accent line
      cy += 8;
    } else if (style === 'double') {
      Title('Experience', x + 5, cy, { size: 12, bold: true, color: tw.slate900 });
      Rect(x, cy - 2, 3, 0.5, { color: tw.slate900 });
      cy += 8;
    } else {
      Title('Experience', x, cy, { size: 11, bold: true, color: style === 'bar' ? 'theme' : tw.slate900 });
      if (style === 'line') Line(x, cy + 2, x + w, cy + 2, { color: 'theme' });
      cy += 8;
    }

    data.experience.forEach(exp => {
      if (chk(cy, 15)) cy = m;
      
      if (style === 'professional') {
        // Timeline dot
        Line(x + 2, cy - 2, x + 2, cy + 20, { color: tw.slate100, width: 0.5 });
        Circle(x + 2, cy - 1, 1.5, { color: 'theme', border: true, borderColor: tw.white, borderWidth: 0.8 });
        
        Title(exp.jobTitle, x + 6, cy, { size: 12, bold: true, color: tw.slate800 });
        Title(`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`, x + w, cy, { size: 8, align: 'right', color: tw.slate400 });
        cy += 5;
        Title(exp.company, x + 6, cy, { size: 10, bold: true, color: 'theme' });
        cy += 5;
        if (exp.responsibilities) {
          cy += Text(exp.responsibilities, x + 6, cy, w - 6, { size: 9, color: tw.slate600 }) + 4;
        }
      } else if (style === 'double') {
        Line(x + 2, cy - 2, x + 2, cy + 20, { color: tw.slate100, width: 0.5 });
        Circle(x + 2, cy - 1, 1.5, { color: tw.white, border: true, borderColor: tw.slate200, borderWidth: 0.5 });
        
        Title(exp.jobTitle, x + 6, cy, { size: 12, bold: true, color: tw.slate900 });
        Rect(x + w - 25, cy - 3, 25, 4, { color: tw.slate50 });
        Title(`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`, x + w, cy, { size: 7, align: 'right', color: tw.slate400, bold: true });
        cy += 5;
        Title(exp.company, x + 6, cy, { size: 9, bold: true, color: 'theme' });
        cy += 5;
        if (exp.responsibilities) {
          cy += Text(exp.responsibilities, x + 6, cy, w - 6, { size: 9, color: tw.slate600 }) + 4;
        }
      } else if (style === 'academic') {
        const leftW = w * 0.25;
        const rightW = w * 0.75 - 5;
        Title(`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`, x, cy, { size: 8, bold: true, color: tw.slate400 });
        Title(exp.jobTitle, x + leftW, cy, { size: 11, bold: true, color: tw.slate900 });
        cy += 5;
        Title(exp.company, x + leftW, cy, { size: 10, bold: true, color: 'theme', italic: true });
        cy += 5;
        if (exp.responsibilities) {
          cy += Text(exp.responsibilities, x + leftW, cy, rightW, { size: 9, color: tw.slate700 }) + 4;
        }
      } else {
        if (style === 'dots') Rect(x - 3, cy - 2, 1.5, 1.5, { color: 'theme' });
        
        Title(exp.jobTitle, x, cy, { size: 11, bold: true, color: tw.slate900 });
        Title(`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`, x + w, cy, { size: 8, align: 'right', color: tw.slate400 });
        cy += 5;
        Title(exp.company, x, cy, { size: 9, bold: true, color: 'theme' });
        cy += 5;
        if (exp.responsibilities) {
          cy += Text(exp.responsibilities, x, cy, w, { size: 9, color: tw.slate600 }) + 4;
        }
      }
    });
    return cy;
  };

  const renderEducation = (x, y, w, style = 'plain') => {
    if (!data.education || !data.education.length) return y;
    let cy = y;
    
    if (style === 'professional') {
      Title('Education', x + 5, cy, { size: 9, bold: true, color: tw.slate400 });
      Line(x, cy + 2, x + w, cy + 2, { color: tw.slate200 });
      cy += 8;
    } else {
      Title('Education', x, cy, { size: 11, bold: true, color: style === 'bar' ? 'theme' : tw.slate900 });
      if (style === 'line') Line(x, cy + 2, x + w, cy + 2, { color: 'theme' });
      if (style === 'bar') Line(x, cy + 2, x + w, cy + 2, { color: tw.slate200 });
      cy += 8;
    }

    data.education.forEach(edu => {
      if (chk(cy, 12)) cy = m;
      if (style === 'academic') {
        const leftW = w * 0.25;
        Title(`${edu.startDate} - ${edu.endDate}`, x, cy, { size: 8, bold: true, color: tw.slate400 });
        Title(edu.institution, x + leftW, cy, { size: 11, bold: true, color: tw.slate900 });
        cy += 5;
        Title(edu.degree, x + leftW, cy, { size: 9, italic: true, color: tw.slate600 });
        cy += 8;
      } else if (style === 'professional') {
        Title(`${edu.startDate} - ${edu.endDate}`, x, cy, { size: 8, bold: true, color: tw.slate400 });
        cy += 4;
        Title(edu.degree, x, cy, { size: 10, bold: true, color: tw.slate900 });
        cy += 4;
        Title(edu.institution, x, cy, { size: 9, color: tw.slate600 });
        cy += 8;
      } else {
        Title(edu.degree, x, cy, { size: 10, bold: true, color: tw.slate800 });
        Title(`${edu.startDate} - ${edu.endDate}`, x + w, cy, { size: 8, align: 'right', color: tw.slate400 });
        cy += 4;
        Title(edu.institution, x, cy, { size: 9, italic: true, color: tw.slate500 });
        cy += 8;
      }
    });
    return cy;
  };

  const renderSkills = (x, y, w, style = 'plain') => {
    if (!data.skills?.categories?.length) return y;
    let cy = y;
    
    if (style === 'professional') {
      Title('Expertise', x, cy, { size: 9, bold: true, color: 'theme' });
      Line(x, cy + 2, x + w, cy + 2, { color: tw.slate200 });
      cy += 8;
    } else {
      Title('Skills & Expertise', x, cy, { size: 11, bold: true, color: style === 'bar' ? 'theme' : tw.slate900 });
      if (style === 'line') Line(x, cy + 2, x + w, cy + 2, { color: 'theme' });
      if (style === 'bar') Line(x, cy + 2, x + w, cy + 2, { color: tw.slate200 });
      cy += 8;
    }

    if (style === 'grid-2') {
      let left = true;
      let gridY = cy;
      const colW = (w - 10) / 2;
      data.skills.categories.forEach(cat => {
        if (!cat.list) return;
        if (chk(gridY, 8)) gridY = m;
        const cx = left ? x : x + colW + 10;
        Title(cat.name + ':', cx, gridY, { size: 9, bold: true, color: tw.slate800 });
        const h = Text(cat.list, cx + doc.getTextWidth(cat.name + ': '), gridY, colW - doc.getTextWidth(cat.name + ': '), { size: 9, color: tw.slate600 });
        if (!left) gridY += Math.max(h, 4.5) + 4;
        left = !left;
      });
      cy = gridY + (left ? 0 : 8);
    } else {
      data.skills.categories.forEach(cat => {
        if (!cat.list) return;
        if (chk(cy, 8)) cy = m;
        Title(cat.name, x, cy, { size: 9, bold: true, color: style === 'professional' ? tw.slate400 : tw.slate800 });
        cy += 4;
        const h = Text(cat.list, x, cy, w, { size: 9, color: tw.slate600 });
        cy += h + 4;
      });
    }
    return cy;
  };

  const renderProjects = (x, y, w, style = 'plain') => {
    if (!data.projects || !data.projects.length) return y;
    let cy = y;
    
    if (style === 'professional') {
      Title('Selected Projects', x + 5, cy, { size: 10, bold: true, color: tw.slate400 });
      Rect(x, cy - 2, 3, 0.5, { color: 'theme' });
      cy += 8;
    } else {
      Title('Projects', x, cy, { size: 11, bold: true, color: style === 'bar' ? 'theme' : tw.slate900 });
      if (style === 'line') Line(x, cy + 2, x + w, cy + 2, { color: 'theme' });
      cy += 8;
    }

    data.projects.forEach(proj => {
      if (chk(cy, 15)) cy = m;
      Title(proj.name, x, cy, { size: 11, bold: true, color: tw.slate800 });
      if (proj.technologies) {
        cy += 4;
        Title(proj.technologies, x, cy, { size: 8, color: 'theme', bold: true });
      }
      cy += 5;
      if (proj.description) {
        const h = Text(proj.description, x, cy, w, { size: 9, color: tw.slate600, italic: style === 'professional' });
        cy += h + 4;
      }
    });
    return cy;
  };

  const renderSummary = (x, y, w, style = 'plain') => {
    if (!data.summary) return y;
    let cy = y;
    
    if (style === 'professional') {
      Title('Summary', x + 5, cy, { size: 10, bold: true, color: tw.slate400 });
      Rect(x, cy - 2, 3, 0.5, { color: 'theme' });
      cy += 8;
    } else {
      Title('Summary', x, cy, { size: 11, bold: true, color: style === 'bar' ? 'theme' : tw.slate900 });
      if (style === 'line') Line(x, cy + 2, x + w, cy + 2, { color: 'theme' });
      cy += 8;
    }

    const h = Text(data.summary, x, cy, w, { size: 9, color: tw.slate700, italic: style === 'italic' });
    cy += h + 8;
    return cy;
  };

  // --- PRECISE LAYOUTS ---
  const layouts = {
    modern: () => {
      const mw = cw * 0.65 - 5;
      const sw = cw * 0.35 - 5;
      const sx = m + cw * 0.65 + 5;
      
      Title((data.personalInfo.fullName || '').toUpperCase(), m, m + 10, { size: 28, bold: true, color: 'theme' });
      Title(data.personalInfo.jobTitle, m, m + 18, { size: 12, bold: true, color: tw.slate800 });
      
      const contacts = [data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location].filter(Boolean).join(' | ');
      Title(contacts, m, m + 24, { size: 9, color: tw.slate500, bold: true });
      Line(m, m + 28, pw - m, m + 28, { color: 'theme', width: 1.5 });
      
      let my = m + 38; let sy = my;
      my = renderSummary(m, my, mw, 'line');
      my = renderExperience(m, my, mw, 'dots');
      my = renderProjects(m, my, mw, 'line');
      sy = renderSkills(sx, sy, sw, 'line');
      sy = renderEducation(sx, sy, sw, 'line');
    },

    professional: () => {
      const mw = cw * 0.65 - 5;
      const sw = cw * 0.35 - 5;
      const sx = m + cw * 0.65 + 5;

      Rect(0, 0, pw, 50, { color: 'theme' });
      Title((data.personalInfo.fullName || '').toUpperCase(), m + 10, 20, { size: 26, bold: true, color: tw.white });
      Title(data.personalInfo.jobTitle, m + 10, 28, { size: 14, color: tw.white });
      
      Line(m + 10, 32, pw - (m + 10), 32, { color: tw.white, width: 0.2 });
      
      let cx = m + 10;
      ['email', 'phone', 'location', 'linkedin'].forEach(k => {
        if (data.personalInfo[k]) {
          DrawIcon(k === 'linkedin' ? 'link' : k, cx, 40, 2, tw.white);
          Title(data.personalInfo[k], cx + 4, 41, { size: 9, color: tw.white });
          cx += doc.getTextWidth(data.personalInfo[k]) + 15;
        }
      });
      
      let my = 60; let sy = 60;
      my = renderSummary(m + 5, my, mw, 'professional');
      my = renderExperience(m + 5, my, mw, 'professional');
      my = renderProjects(m + 5, my, mw, 'professional');
      sy = renderSkills(sx, sy, sw, 'professional');
      sy = renderEducation(sx, sy, sw, 'professional');
    },

    'two-column': () => {
      const sw = cw * 0.35 - 5;
      const mw = cw * 0.65 - 5;
      const mx = m + cw * 0.35 + 5;

      Rect(0, 45, m + cw * 0.35, ph - 45, { color: tw.slate50 });
      Rect(0, 0, pw, 45, { color: tw.slate900 }); 
      Title((data.personalInfo.fullName || '').toUpperCase(), m, 22, { size: 22, bold: true, color: tw.white });
      Title((data.personalInfo.jobTitle || '').toUpperCase(), m, 30, { size: 10, color: tw.slate400 });

      let sy = 55; let my = 55;

      // Contact Icons on Right
      let cx = mx + 5;
      ['phone', 'email', 'location'].forEach(k => {
        if (data.personalInfo[k]) {
          Rect(cx - 3, my - 4, 6, 6, { color: tw.white });
          DrawIcon(k, cx, my - 1, 2, tw.slate400);
          Title(data.personalInfo[k], cx + 6, my, { size: 8, color: tw.slate500, bold: true });
          cx += doc.getTextWidth(data.personalInfo[k]) + 15;
        }
      });
      my += 8;
      Line(mx, my, pw - m, my, { color: tw.slate100 });
      my += 10;

      sy = renderSummary(m, sy, sw, 'bar');
      sy = renderEducation(m, sy, sw, 'bar');
      sy = renderSkills(m, sy, sw, 'bar');

      my = renderExperience(mx, my, mw, 'double');
      my = renderProjects(mx, my, mw, 'double');
    },

    technology: () => {
      const sw = 72; // matching w-72 tailwind
      const mw = pw - sw - m;
      const mx = sw + 5;

      Rect(0, 0, sw, ph, { color: tw.slate100 });
      
      Rect(m, m, 15, 2, { color: 'theme' });
      const names = (data.personalInfo.fullName || '').split(' ');
      Title(names[0]?.toUpperCase(), m, m + 15, { size: 20, bold: true, color: tw.slate900 });
      if (names[1]) Title(names.slice(1).join(' ').toUpperCase(), m, m + 22, { size: 20, bold: true, color: tw.slate400 });
      Title((data.personalInfo.jobTitle || '').toUpperCase(), m, m + 30, { size: 9, bold: true, color: tw.slate500 });
      
      let sy = m + 45;
      Title('CONTACT', m, sy, { size: 9, bold: true, color: tw.slate400 });
      Line(m, sy + 2, sw - m, sy + 2, { color: tw.slate200 });
      sy += 8;
      
      // Fixed Tech Template Contact Stack
      ['email', 'phone', 'linkedin', 'location'].forEach(k => {
        if (data.personalInfo[k]) {
          Title(k.toUpperCase(), m, sy, { size: 7, bold: true, color: tw.slate400 });
          Title(data.personalInfo[k], m, sy + 4, { size: 8, color: tw.slate800 });
          sy += 10;
        }
      });
      sy += 5;
      sy = renderSkills(m, sy, sw - m * 2, 'plain');

      let my = m + 15;
      my = renderSummary(mx, my, mw - m, 'plain');
      my = renderExperience(mx, my, mw - m, 'professional'); // Reuse professional for timeline
      my = renderProjects(mx, my, mw - m, 'plain');
      my = renderEducation(mx, my, mw - m, 'plain');
    },

    creative: () => {
      const sw = cw * 0.35 - 5;
      const mw = cw * 0.65 - 5;
      const mx = m + cw * 0.35 + 5;

      Circle(m + 15, m + 15, 12, { color: 'theme' });
      Title((data.personalInfo.fullName || ' ').charAt(0).toUpperCase(), m + 15, m + 19, { size: 20, bold: true, color: tw.white, align: 'center' });
      
      let sy = m + 40;
      Title((data.personalInfo.fullName || '').toUpperCase(), m, sy, { size: 16, bold: true, color: 'theme' });
      sy += 5;
      Title((data.personalInfo.jobTitle || '').toUpperCase(), m, sy, { size: 9, bold: true, color: tw.slate400 });
      sy += 12;

      Title('CONTACT', m, sy, { size: 8, bold: true, color: tw.slate300 });
      sy += 6;
      sy += Text([data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location].filter(Boolean).join('\n'), m, sy, sw, { size: 8, color: tw.slate600 }) + 8;

      sy = renderSkills(m, sy, sw, 'plain');
      sy = renderEducation(m, sy, sw, 'plain');

      let my = m + 15;
      my = renderSummary(mx, my, mw, 'italic');
      my = renderExperience(mx, my, mw, 'dots');
    },

    executive: () => {
      let cy = m + 10;
      Title((data.personalInfo.fullName || '').toUpperCase(), pw/2, cy, { size: 26, bold: true, color: tw.slate900, align: 'center' });
      cy += 6;
      Title([data.personalInfo.location, data.personalInfo.phone, data.personalInfo.email].filter(Boolean).join('  /  '), pw/2, cy, { size: 8, color: tw.slate500, align: 'center', bold: true });
      cy += 6;
      Line(m, cy, pw - m, cy, { color: tw.slate200, width: 0.8 });
      cy += 12;

      Title('EXECUTIVE PROFILE', pw/2, cy, { size: 8, bold: true, color: tw.slate400, align: 'center' });
      cy += 6;
      cy += Text(data.summary, pw/2, cy, cw - 30, { size: 10, italic: true, color: tw.slate700, align: 'center' }) + 10;
      
      cy = renderExperience(m, cy, cw, 'plain');

      const colW = (cw - 10) / 2;
      const startY = cy;
      renderEducation(m, startY, colW, 'line');
      renderSkills(m + colW + 10, startY, colW, 'line');
    },

    minimal: () => {
      let cy = m + 5;
      Title((data.personalInfo.fullName || '').toUpperCase(), m, cy, { size: 22, bold: true, color: tw.slate900 });
      cy += 6;
      Title([data.personalInfo.location, data.personalInfo.phone, data.personalInfo.email].filter(Boolean).join('  |  '), m, cy, { size: 9, color: tw.slate600 });
      cy += 6;
      Line(m, cy, pw - m, cy, { color: tw.slate900, width: 0.8 });
      cy += 10;

      cy = renderSummary(m, cy, cw, 'plain');
      cy = renderExperience(m, cy, cw, 'plain');
      cy = renderSkills(m, cy, cw, 'plain');
      cy = renderEducation(m, cy, cw, 'plain');
    },

    'ats-standard': () => {
      let cy = m + 5;
      Title((data.personalInfo.fullName || '').toUpperCase(), pw/2, cy, { size: 22, bold: true, color: tw.black, align: 'center' });
      cy += 6;
      Title([data.personalInfo.location, data.personalInfo.phone, data.personalInfo.email].filter(Boolean).join(' | '), pw/2, cy, { size: 9, color: tw.slate800, align: 'center' });
      cy += 6;
      Line(pw/2 - 50, cy, pw/2 + 50, cy, { color: tw.slate900, width: 0.5 });
      cy += 10;

      cy = renderSummary(m, cy, cw, 'plain');
      cy = renderSkills(m, cy, cw, 'grid-2');
      cy = renderExperience(m, cy, cw, 'plain');
      cy = renderEducation(m, cy, cw, 'plain');
    },
    
    academic: () => {
      let cy = m + 10;
      Title((data.personalInfo.fullName || '').toUpperCase(), pw/2, cy, { size: 24, bold: true, color: 'theme', align: 'center' });
      cy += 6;
      Title(data.personalInfo.location, pw/2, cy, { size: 9, color: tw.slate600, align: 'center', italic: true });
      cy += 6;
      Title([data.personalInfo.email, data.personalInfo.phone, data.personalInfo.linkedin].filter(Boolean).join('    '), pw/2, cy, { size: 8, color: tw.slate500, align: 'center', bold: true });
      cy += 6;
      Line(pw/2 - 60, cy, pw/2 + 60, cy, { color: tw.slate200, width: 0.5 });
      cy += 12;

      cy = renderSummary(m, cy, cw, 'line');
      cy = renderEducation(m, cy, cw, 'academic');
      cy = renderExperience(m, cy, cw, 'academic');
      cy = renderProjects(m, cy, cw, 'plain');
      cy = renderSkills(m, cy, cw, 'grid-2');
    },

    default: () => {
      layouts.minimal();
    }
  };

  const executeLayout = layouts[template] || layouts['default'];
  executeLayout();
};
