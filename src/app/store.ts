import create from 'zustand';
import { Playbook } from '../data/schemas';

interface StoreState {
  playbook?: Playbook;
  setPlaybook: (pb: Playbook) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useStore = create<StoreState>((set) => ({
  playbook: undefined,
  setPlaybook: (pb) => set({ playbook: pb }),
  theme: 'light',
  toggleTheme: () =>
    set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
}));
