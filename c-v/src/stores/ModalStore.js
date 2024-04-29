import { create } from 'zustand';

const useModalStore = create((set) => ({
  modalIsOpen: false,
  setModalIsOpen: (bool) =>
    set({
      modalIsOpen: bool,
    }),
  modalType: '',
  setModalType: (type) => set({ modalType: type }),
  confirmFn: () => {},
  setConfirmFn: (fn) =>
    set((prev) => {
      prev.confirmFn = fn;
      return prev;
    }),
  confirmFnParam: 0,
  setConfirmFnParam: (param) => set({ confirmFnParam: param }),
}));

export default useModalStore;
