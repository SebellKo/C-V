import { create } from 'zustand';

const useListStore = create((set) => ({
  isClick: false,
  toggleClick: () => set((prev) => ({ isClick: !prev.isClick })),
}));

export default useListStore;
