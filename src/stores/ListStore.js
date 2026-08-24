import { create } from 'zustand';

const getExistingSelectedListId = (lists, selectedListId) =>
  lists.some((list) => list.id === selectedListId) ? selectedListId : null;

const useListStore = create((set) => ({
  lists: [],
  selectedListId: null,
  isInitialized: false,
  initialize: (lists, selectedListId) =>
    set({
      lists,
      selectedListId: getExistingSelectedListId(lists, selectedListId),
      isInitialized: true,
    }),
  setLists: (lists) =>
    set((state) => ({
      lists,
      selectedListId: getExistingSelectedListId(
        lists,
        state.selectedListId,
      ),
    })),
  setSelectedListId: (selectedListId) => set({ selectedListId }),
}));

export { useListStore };
