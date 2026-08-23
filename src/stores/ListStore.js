import { create } from 'zustand';

import getCurrentListId from '../api/getCurrentListId';
import getList from '../api/getList';
import setCurrentListId from '../api/setCurrentListId';

let loadPromise;

const useListStore = create((set, get) => ({
  lists: [],
  selectedListId: null,
  isLoading: true,
  error: null,
  load: () => {
    if (!loadPromise) {
      set({ isLoading: true, error: null });
      loadPromise = Promise.all([getList(), getCurrentListId()])
        .then(([lists, selectedListId]) => {
          set({ lists, selectedListId, isLoading: false });
        })
        .catch((error) => {
          loadPromise = undefined;
          set({ error, isLoading: false });
          throw error;
        });
    }

    return loadPromise;
  },
  refresh: async () => {
    set({ isLoading: true, error: null });

    try {
      const lists = await getList();
      set((state) => ({
        lists,
        selectedListId: lists.some(
          (list) => list.id === state.selectedListId,
        )
          ? state.selectedListId
          : null,
        isLoading: false,
      }));
      return lists;
    } catch (error) {
      set({ error, isLoading: false });
      throw error;
    }
  },
  select: async (selectedListId) => {
    const previousSelectedListId = get().selectedListId;
    set({ selectedListId, error: null });

    try {
      const result = await setCurrentListId(selectedListId);
      return result;
    } catch (error) {
      set((state) => ({
        selectedListId:
          state.selectedListId === selectedListId
            ? previousSelectedListId
            : state.selectedListId,
        error,
      }));
      throw error;
    }
  },
}));

export { useListStore };
