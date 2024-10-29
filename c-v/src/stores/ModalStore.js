import { create } from 'zustand';

// const useModalStore = create((set) => ({
//   modalIsOpen: false,
//   setModalIsOpen: (bool) =>
//     set({
//       modalIsOpen: bool,
//     }),
//   modalType: '',
//   setModalType: (type) => set({ modalType: type }),
//   confirmFn: () => {},
//   setConfirmFn: (fn) =>
//     set((prev) => {
//       prev.confirmFn = fn;
//       return prev;
//     }),
//   confirmFnParam: 0,
//   setConfirmFnParam: (param) => set({ confirmFnParam: param }),
// }));

const createModalStore = () =>
  create((set) => ({
    isOpen: false,
    openModal: () => set({ isOpen: true }),
    closeModal: () => set({ isOpen: false }),
  }));

const useAddListModalStore = createModalStore();
const useEditListModalStore = createModalStore();

export { useAddListModalStore, useEditListModalStore };
