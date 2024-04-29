import styled from 'styled-components';

import useModalStore from '../../stores/ModalStore.js';

const ModifyButtonsWrapper = styled.div`
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

  const addClickHandler = () => {
    setModalType('input');
    setModalIsOpen(true);
  };

  return (
    <ModifyButtonsWrapper>
      <button onClick={addClickHandler}>Add</button>
      <span> / </span>
      <button>Edit</button>
    </ModifyButtonsWrapper>
  );
};

export default ModifyButtons;
