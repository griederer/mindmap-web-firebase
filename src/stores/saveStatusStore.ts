import { create } from 'zustand';

export type SaveStatus = 'idle' | 'pending' | 'saving' | 'saved' | 'error';

interface SaveStatusState {
  status: SaveStatus;
  lastSaved: number | null;
  setStatus: (status: SaveStatus) => void;
  setLastSaved: (timestamp: number) => void;
}

export const useSaveStatusStore = create<SaveStatusState>((set) => ({
  status: 'idle',
  lastSaved: null,
  setStatus: (status) => set({ status }),
  setLastSaved: (timestamp) => set({ lastSaved: timestamp }),
}));
