import { styled } from 'styled-components';

import CommandList from './CommandList';
import NewCommandButton from './NewCommandButton';
import {
  useAddCommandModalStore,
  useAddListModalStore,
  useDeleteConfirmModalStore,
  useEditListModalStore,
} from '../../stores/ModalStore';
import AddListModal from '../Modal/AddListModal';
import Modal from '../Modal/Modal';
import EditListModal from '../Modal/EditListModal';
import AddCommandModal from '../Modal/AddCommandModal';
import DeleteConfirmModal from '../Modal/DeleteConfirmModal';

const MainContainer = styled.div`
  width: 100%;
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const Main = () => {
  const { isOpen: isAddModalOpen, closeModal: closeAddListModal } =
    useAddListModalStore();
  const { isOpen: isEditModalOpen, closeModal: closeEditListModal } =
    useEditListModalStore();
  const { isOpen: isAddCommandModalOpen, closeModal: closeAddCommandModal } =
    useAddCommandModalStore();
  const { isOpen: isDeleteModalOpen, closeModal: closeDeleteModal } =
    useDeleteConfirmModalStore();

  return (
    <>
      <MainContainer>
        <CommandList></CommandList>
        <NewCommandButton></NewCommandButton>
      </MainContainer>
      {isAddModalOpen && (
        <Modal onClose={closeAddListModal}>
          <AddListModal></AddListModal>
        </Modal>
      )}
      {isEditModalOpen && (
        <Modal onClose={closeEditListModal}>
          <EditListModal></EditListModal>
        </Modal>
      )}
      {isAddCommandModalOpen && (
        <Modal onClose={closeAddCommandModal}>
          <AddCommandModal></AddCommandModal>
        </Modal>
      )}
      {isDeleteModalOpen && (
        <Modal onClose={closeDeleteModal}>
          <DeleteConfirmModal></DeleteConfirmModal>
        </Modal>
      )}
    </>
  );
};

export default Main;
