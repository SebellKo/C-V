import styled from 'styled-components';

import useModalStore from '../../stores/ModalStore.js';

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

const ModifyButtons = () => {
  const { setModalIsOpen, setModalType } = useModalStore((state) => ({
    setModalIsOpen: state.setModalIsOpen,
    setModalType: state.setModalType,
  }));

  const handleAddClick = () => {
    setModalType('input');
    setModalIsOpen(true);
  };

  const handleEditClick = () => {
    setModalType('list');
    setModalIsOpen(true);
  };

  return (
    <ModifyButtonContainer>
      <button onClick={handleAddClick}>Add</button>
      <span> / </span>
      <button onClick={handleEditClick}>Edit</button>
    </ModifyButtonContainer>
  );
};

export default ModifyButtons;
