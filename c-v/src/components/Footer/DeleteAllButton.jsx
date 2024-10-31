import { styled } from 'styled-components';
import { useDeleteConfirmModalStore } from '../../stores/ModalStore';
import { useListStore } from '../../stores/ListStore';

const StyledDeleteAllButton = styled.button`
  background: none;
  color: #dd959a;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    color: #d5525b;
  }
`;

const DeleteAllButton = () => {
  const openDeleteConfirmModal = useDeleteConfirmModalStore(
    (state) => state.openModal,
  );
  const currentListName = useListStore((state) => state.currentListName);

  return (
    <StyledDeleteAllButton
      onClick={openDeleteConfirmModal}
      disabled={currentListName === 'Select'}
    >
      Delete All
    </StyledDeleteAllButton>
  );
};

export default DeleteAllButton;
