# Product Requirements Document (PRD): Next-Gen Resume Builder

## 1. Product Overview
The Next-Gen Resume Builder is a modern, web-based application designed to help users create ATS-friendly, professional resumes effortlessly. Transitioning from a vanilla HTML/JS architecture to a robust modern React stack, this upgraded version focuses on mobile-first responsiveness, enhanced UI/UX, and intelligent automation features like PDF/DOCX parsing.

## 2. Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | React 18 + Vite |
| **Language** | JavaScript (JSX) / TypeScript |
| **Styling** | Tailwind CSS v3 (design token system) |
| **Routing** | React Router DOM v6 |
| **State Mgt** | React useState / Context API |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **UI Components** | shadcn/ui (Radix UI primitives) |
| **Local Database** | Dexie.js (IndexedDB) |
| **Reactivity** | dexie-react-hooks (`useLiveQuery`) |

## 3. Design System & Typography

### Typography
- **Display / Headings:** `Barlow Condensed` — Bold, uppercase, wide tracking (Used for section titles, hero text, and impactful UI elements).
- **Body / UI:** `Inter` — Regular / Medium / Semibold (Used for form inputs, paragraph text, buttons, and general UI readability).

### Styling Strategy
- Mobile-first responsive design utilizing Tailwind utility classes.
- Design token system configured via Tailwind (`tailwind.config.js`) for consistent spacing, colors, and typography.
- Sleek, modern components leveraging `shadcn/ui` tailored with `Framer Motion` for smooth page transitions and micro-interactions.

## 4. Key Features

### 4.1. Intelligent Resume Parsing (New)
- **Feature:** Users can upload an existing PDF or DOCX resume.
- **Functionality:** The system will extract text and automatically map it to the builder's form fields (Personal Info, Experience, Education, Skills, etc.).
- **Benefit:** Eliminates manual data entry for users updating existing resumes.

### 4.2. Interactive Builder Interface
- **Form System:** A step-by-step or side-by-side split screen (form on left, live preview on right).
- **Mobile Friendly:** On mobile devices, the UI switches to a bottom-sheet/tab-based approach for easy form filling without completely losing the preview context.
- **Intellisense / Auto-suggestions:** Predictive dropdowns for Job Titles, Companies, Degrees, Institutions, and Skills.
- **Smart Defaults:** Pre-filled "Professional Summary" fallbacks and real-time formatting.

### 4.3. ATS-Friendly Templates Library
- Offer a robust library of templates (expanding on the current 5 templates).
- Ensure all templates are structured with clear semantic hierarchy (H1, H2, bullet lists) that Applicant Tracking Systems (ATS) can easily parse.
- Support deep customization (theme colors, typography selection per template).

### 4.4. High-Fidelity Exports
- **DOCX Export:** Generates perfectly formatted Microsoft Word documents using `docx.js`.
- **PDF Export:** Allows users to download via `jsPDF` and `html2canvas` (with 300 DPI high-quality rendering) OR utilizing browser print dialogs for native text-selectable PDFs.

### 4.5. Offline Support & Local Data
- Uses indexedDB (`Dexie.js`) to auto-save user progress locally.
- Multiple resume profiles can be saved and managed on the user's browser without requiring a backend database.

## 5. Implementation Plan (Phases)

### Phase 1: Project Setup & Architecture
- Initialize React 18 + Vite project.
- Configure Tailwind CSS, shadcn/ui, and custom fonts (`Barlow Condensed` & `Inter`).
- Setup React Router structure (Home, Builder, Templates, My Resumes).
- Initialize Dexie.js database schema for local storage.

### Phase 2: Core UI Components & Navigation
- Build layout wrappers, navigation bars, and mobile menus.
- Implement reusable form components (Inputs, Textareas, Auto-suggest fields, Date Pickers) using shadcn/ui.
- Integrate Framer Motion for page-to-page transitions.

### Phase 3: Resume Builder Form & State Management
- Develop Context API providers to hold current resume state.
- Build the data entry steps: Personal Info, Summary, Experience, Education, Skills, Projects, Certifications.
- Integrate Dexie.js to auto-save keystrokes to IndexedDB.

### Phase 4: Resume Parsing Logic
- Research and integrate client-side parsing libraries (e.g., pdf.js for text extraction, mammoth.js for DOCX).
- Build the mapping logic to parse string data into structured JSON format for the builder state.
- Create the drag-and-drop upload UI component.

### Phase 5: Template Engine & Live Preview
- Port the existing vanilla HTML/CSS templates into reusable React components (`<Template1 />`, `<Template2 />`).
- Ensure templates react natively to Context state changes.
- Ensure perfect ATS-friendly DOM structures inside the templates.

### Phase 6: Export Mechanisms
- Implement `docx.js` mapping logic (porting from `js/builder.js`).
- Implement PDF generation pipeline.
- Test export fidelity across various OS and browser combinations.

### Phase 7: Polish & Launch
- Accessibility (a11y) audits.
- Mobile responsiveness cross-testing.
- Final animations, loading states, and error handling.
- Deploy to GitHub Pages or static host.
