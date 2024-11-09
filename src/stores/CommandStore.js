import { create } from 'zustand';

const useCommandStore = create((set) => ({
  selectedCommand: '',
  setSelectedCommand: (selected) => set({ selectedCommand: selected }),
  resetSelectedCommand: () => set({ selectedCommand: '' }),
}));

export default useCommandStore;
