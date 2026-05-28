import { styled } from 'styled-components';

import { useDeleteConfirmModalStore } from '../../stores/ModalStore';
import { useListStore } from '../../stores/ListStore';

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

const StyledDeleteAllButton = styled.button`
  background: none;
  color: rgb(241 94 104);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    color: rgb(248 19 35);
  }
`;

export default DeleteAllButton;
