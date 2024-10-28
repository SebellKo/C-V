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
    modalIsOpen: false,
    openModal: () => set({ modalIsOpen: true }),
    closeModal: () => set({ modalIsOpen: false }),
  }));

const useAddListModalStore = createModalStore();
const useEditListModalStore = createModalStore();

export default { useAddListModalStore, useEditListModalStore };
