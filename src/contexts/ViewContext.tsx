/**
 * View Context
 * Manages navigation between project gallery and canvas views
 */

import { createContext, useContext, useState, ReactNode } from 'react';

type View = 'gallery' | 'canvas';

interface ViewContextType {
  currentView: View;
  currentProjectId: string | null;
  showGallery: () => void;
  showCanvas: (projectId: string) => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export function ViewProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<View>('gallery');
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  const showGallery = () => {
    setCurrentView('gallery');
    setCurrentProjectId(null);
  };

  const showCanvas = (projectId: string) => {
    setCurrentProjectId(projectId);
    setCurrentView('canvas');
  };

  return (
    <ViewContext.Provider value={{ currentView, currentProjectId, showGallery, showCanvas }}>
      {children}
    </ViewContext.Provider>
  );
}

export function useView() {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error('useView must be used within a ViewProvider');
  }
  return context;
}
