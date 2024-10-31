import styled from 'styled-components';
import { useAddCommandModalStore } from '../../stores/ModalStore';
import { useListStore } from '../../stores/ListStore';

const StyledNewCommandButton = styled.button`
  background: none;
  color: #c6c6c6;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    color: #6a6a6a;
  }
`;

const NewCommandButton = () => {
  const openAddCommandModal = useAddCommandModalStore(
    (state) => state.openModal,
  );
  const currentListName = useListStore((state) => state.currentListName);

  return (
    <StyledNewCommandButton
      onClick={openAddCommandModal}
      disabled={currentListName === 'Select'}
    >
      New Command
    </StyledNewCommandButton>
  );
};

export default NewCommandButton;
