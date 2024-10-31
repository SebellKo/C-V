import { create } from 'zustand';

const createModalStore = () =>
  create((set) => ({
    isOpen: false,
    openModal: () => set({ isOpen: true }),
    closeModal: () => set({ isOpen: false }),
  }));

const useAddListModalStore = createModalStore();
const useEditListModalStore = createModalStore();
const useAddCommandModalStore = createModalStore();
const useDeleteConfirmModalStore = createModalStore();

export {
  useAddListModalStore,
  useEditListModalStore,
  useAddCommandModalStore,
  useDeleteConfirmModalStore,
};
