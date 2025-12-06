/**
 * Theme Type Definitions
 * Supports multiple visual themes including chalkboard
 */

export interface ThemeColors {
  // Canvas
  background: string;
  backgroundPattern?: 'none' | 'grid' | 'dots' | 'chalkboard';

  // Nodes
  nodeBackground: string;
  nodeBorder: string;
  nodeText: string;
  nodeTextSecondary: string;

  // Branch colors (rotating for L1 children)
  branchColors: string[];

  // Connections
  connectionDefault: string;
  connectionHighlight: string;

  // UI
  selectionRing: string;
  hoverHighlight: string;
}

export interface ThemeFonts {
  title: string;
  body: string;
  mono: string;
}

export interface ThemeEffects {
  // Node style
  nodeShape: 'rectangle' | 'rounded' | 'pill' | 'organic' | 'none';
  nodeShadow: boolean;
  nodeOpacity: number;

  // Connection style
  connectionStyle: 'straight' | 'curved' | 'organic' | 'sketchy';
  connectionWidth: number;

  // Visual effects
  handDrawn: boolean;        // Rough/sketchy appearance
  textureOverlay?: string;   // Optional texture image
  glowEffect: boolean;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
  fonts: ThemeFonts;
  effects: ThemeEffects;
}

// ============================================================================
// PREDEFINED THEMES
// ============================================================================

export const THEME_CHALKBOARD: Theme = {
  id: 'chalkboard',
  name: 'Chalkboard',
  description: 'Classic classroom chalkboard aesthetic',
  colors: {
    background: '#2a3b2a',  // Dark green chalkboard
    backgroundPattern: 'chalkboard',
    nodeBackground: 'transparent',
    nodeBorder: 'rgba(255, 255, 255, 0.3)',
    nodeText: '#ffffff',
    nodeTextSecondary: 'rgba(255, 255, 255, 0.7)',
    branchColors: [
      '#ffffff',   // White chalk
      '#ffeb3b',   // Yellow chalk
      '#ff9800',   // Orange chalk
      '#4fc3f7',   // Light blue chalk
      '#81c784',   // Light green chalk
      '#f48fb1',   // Pink chalk
      '#ce93d8',   // Purple chalk
    ],
    connectionDefault: 'rgba(255, 255, 255, 0.6)',
    connectionHighlight: '#ffffff',
    selectionRing: '#ffeb3b',
    hoverHighlight: 'rgba(255, 255, 255, 0.1)',
  },
  fonts: {
    title: "'Caveat', 'Comic Sans MS', cursive",
    body: "'Caveat', 'Comic Sans MS', cursive",
    mono: "'Courier New', monospace",
  },
  effects: {
    nodeShape: 'none',
    nodeShadow: false,
    nodeOpacity: 1,
    connectionStyle: 'sketchy',
    connectionWidth: 2,
    handDrawn: true,
    glowEffect: true,
  },
};

export const THEME_LIGHT: Theme = {
  id: 'light',
  name: 'Light',
  description: 'Clean, modern light theme',
  colors: {
    background: '#ffffff',
    backgroundPattern: 'dots',
    nodeBackground: '#f8fafc',
    nodeBorder: '#e2e8f0',
    nodeText: '#1e293b',
    nodeTextSecondary: '#64748b',
    branchColors: [
      '#ef4444',  // Red
      '#f97316',  // Orange
      '#eab308',  // Yellow
      '#22c55e',  // Green
      '#3b82f6',  // Blue
      '#8b5cf6',  // Purple
      '#ec4899',  // Pink
    ],
    connectionDefault: '#94a3b8',
    connectionHighlight: '#3b82f6',
    selectionRing: '#3b82f6',
    hoverHighlight: 'rgba(59, 130, 246, 0.1)',
  },
  fonts: {
    title: "'Inter', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  effects: {
    nodeShape: 'rounded',
    nodeShadow: true,
    nodeOpacity: 1,
    connectionStyle: 'curved',
    connectionWidth: 2,
    handDrawn: false,
    glowEffect: false,
  },
};

export const THEME_DARK: Theme = {
  id: 'dark',
  name: 'Dark',
  description: 'Modern dark theme',
  colors: {
    background: '#0f172a',
    backgroundPattern: 'dots',
    nodeBackground: '#1e293b',
    nodeBorder: '#334155',
    nodeText: '#f1f5f9',
    nodeTextSecondary: '#94a3b8',
    branchColors: [
      '#f87171',  // Red
      '#fb923c',  // Orange
      '#facc15',  // Yellow
      '#4ade80',  // Green
      '#60a5fa',  // Blue
      '#a78bfa',  // Purple
      '#f472b6',  // Pink
    ],
    connectionDefault: '#475569',
    connectionHighlight: '#60a5fa',
    selectionRing: '#60a5fa',
    hoverHighlight: 'rgba(96, 165, 250, 0.1)',
  },
  fonts: {
    title: "'Inter', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  effects: {
    nodeShape: 'rounded',
    nodeShadow: true,
    nodeOpacity: 1,
    connectionStyle: 'curved',
    connectionWidth: 2,
    handDrawn: false,
    glowEffect: false,
  },
};

// All available themes
export const THEMES: Theme[] = [
  THEME_LIGHT,
  THEME_DARK,
  THEME_CHALKBOARD,
];

export const DEFAULT_THEME = THEME_CHALKBOARD;
