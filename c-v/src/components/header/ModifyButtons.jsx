import styled from 'styled-components';

import {
  useAddListModalStore,
  useEditListModalStore,
} from '../../stores/ModalStore';

const ModifyButtons = () => {
  const openAddModal = useAddListModalStore((state) => state.openModal);
  const openEditListModal = useEditListModalStore((state) => state.openModal);

  return (
    <ModifyButtonContainer>
      <button onClick={openAddModal}>Add</button>
      <span> / </span>
      <button onClick={openEditListModal}>Edit</button>
    </ModifyButtonContainer>
  );
};

const ModifyButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  > button,
  span {
    font-size: 12px;
    font-weight: 600;
    color: #adadad;
  }
  > button {
    background: none;
    transition: all 0.3s ease;
    cursor: pointer;
    &:hover {
      color: #414141;
    }
  }
`;

export default ModifyButtons;
