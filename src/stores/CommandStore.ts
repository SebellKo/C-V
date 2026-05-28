import { create } from 'zustand';
import type { CommandText } from '../types/domain';

interface CommandStore {
  selectedCommand: CommandText;
  setSelectedCommand: (selected: CommandText) => void;
  resetSelectedCommand: () => void;
}

const useCommandStore = create<CommandStore>((set) => ({
  selectedCommand: '',
  setSelectedCommand: (selected) => set({ selectedCommand: selected }),
  resetSelectedCommand: () => set({ selectedCommand: '' }),
}));

export default useCommandStore;
