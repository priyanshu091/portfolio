// Tool data for the Camera Aperture Reveal section.
// Order matters — the default in-focus card is the middle one (Premiere Pro, index 2).

export interface Tool {
  id: string;
  name: string;
  abbr: string;            // big label on the viewfinder card
  color: string;           // brand glow color
  gradient: [string, string]; // card background gradient (top -> bottom)
  tagline: string;         // bottom HUD strip text
  projectsCount: number;   // used in aria-label / future project pages
}

export const tools: Tool[] = [
  {
    id: 'after-effects',
    name: 'After Effects',
    abbr: 'Ae',
    color: '#a78bfa',
    gradient: ['#2a1a4a', '#0d0618'],
    tagline: 'VFX & MOTION',
    projectsCount: 48,
  },
  {
    id: 'premiere-pro',
    name: 'Premiere Pro',
    abbr: 'Pr',
    color: '#a5b4fc',
    gradient: ['#1e1b4b', '#0a0a18'],
    tagline: 'EDIT · TIMELINE',
    projectsCount: 150,
  },
  {
    id: 'photoshop',
    name: 'Photoshop',
    abbr: 'Ps',
    color: '#7dd3fc',
    gradient: ['#0c2a3a', '#06121a'],
    tagline: 'DESIGN · THUMBS',
    projectsCount: 96,
  },
  {
    id: 'capcut',
    name: 'CapCut',
    abbr: 'CapCut',
    color: '#e5e5e5',
    gradient: ['#2a2a2a', '#0a0a0a'],
    tagline: 'MOBILE · QUICK',
    projectsCount: 72,
  },
  {
    id: 'filmora',
    name: 'Filmora',
    abbr: 'Filmora',
    color: '#6ee7b7',
    gradient: ['#0c3a2a', '#06180f'],
    tagline: 'QUICK CUTS',
    projectsCount: 40,
  },
];

/** Default focused card on load — Premiere Pro (middle of 5). */
export const DEFAULT_FOCUS_INDEX = 2;

/** Brand pink used across the section. */
export const APERTURE_PINK = '#ec4899';
