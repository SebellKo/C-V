import { create } from 'zustand';

interface ModalStore {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const createModalStore = () =>
  create<ModalStore>((set) => ({
    isOpen: false,
    openModal: () => set({ isOpen: true }),
    closeModal: () => set({ isOpen: false }),
  }));

const useAddListModalStore = createModalStore();
const useEditListModalStore = createModalStore();
const useAddCommandModalStore = createModalStore();
const useDeleteConfirmModalStore = createModalStore();
const useEditCommandModalStore = createModalStore();

export {
  useAddListModalStore,
  useEditListModalStore,
  useAddCommandModalStore,
  useDeleteConfirmModalStore,
  useEditCommandModalStore,
};
