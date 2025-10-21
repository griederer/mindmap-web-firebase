/**
 * Presentation Store - Zustand
 * Manages presentation mode, recording, and action playback
 */

import { create } from 'zustand';

interface PresentationState {
  // Recording state
  isRecording: boolean;
  recordingStartTime: number | null;
  
  // Presentation state
  isPresenting: boolean;
  currentActionIndex: number;
  totalActions: number;
  
  // Playback control
  isPaused: boolean;
  playbackSpeed: number; // 1 = normal, 2 = 2x, 0.5 = 0.5x
  
  // Operations
  startRecording: () => void;
  stopRecording: () => void;
  startPresentation: (totalActions: number) => void;
  stopPresentation: () => void;
  nextAction: () => void;
  previousAction: () => void;
  goToAction: (index: number) => void;
  pausePresentation: () => void;
  resumePresentation: () => void;
  setPlaybackSpeed: (speed: number) => void;
  resetPresentation: () => void;
}

export const usePresentationStore = create<PresentationState>((set, get) => ({
  // Initial state
  isRecording: false,
  recordingStartTime: null,
  isPresenting: false,
  currentActionIndex: 0,
  totalActions: 0,
  isPaused: false,
  playbackSpeed: 1,
  
  // Start recording actions
  startRecording: () => {
    set({
      isRecording: true,
      recordingStartTime: Date.now(),
    });
  },
  
  // Stop recording
  stopRecording: () => {
    set({
      isRecording: false,
      recordingStartTime: null,
    });
  },
  
  // Start presentation mode
  startPresentation: (totalActions: number) => {
    set({
      isPresenting: true,
      currentActionIndex: 0,
      totalActions,
      isPaused: false,
    });
  },
  
  // Stop presentation mode
  stopPresentation: () => {
    set({
      isPresenting: false,
      currentActionIndex: 0,
      totalActions: 0,
      isPaused: false,
    });
  },
  
  // Go to next action
  nextAction: () => {
    const { currentActionIndex, totalActions } = get();
    if (currentActionIndex < totalActions - 1) {
      set({ currentActionIndex: currentActionIndex + 1 });
    }
  },
  
  // Go to previous action
  previousAction: () => {
    const { currentActionIndex } = get();
    if (currentActionIndex > 0) {
      set({ currentActionIndex: currentActionIndex - 1 });
    }
  },
  
  // Jump to specific action
  goToAction: (index: number) => {
    const { totalActions } = get();
    const clampedIndex = Math.max(0, Math.min(totalActions - 1, index));
    set({ currentActionIndex: clampedIndex });
  },
  
  // Pause presentation
  pausePresentation: () => {
    set({ isPaused: true });
  },
  
  // Resume presentation
  resumePresentation: () => {
    set({ isPaused: false });
  },
  
  // Set playback speed
  setPlaybackSpeed: (speed: number) => {
    const clampedSpeed = Math.max(0.25, Math.min(3, speed));
    set({ playbackSpeed: clampedSpeed });
  },
  
  // Reset presentation to beginning
  resetPresentation: () => {
    set({ currentActionIndex: 0 });
  },
}));
