import { styled } from 'styled-components';
import useModalStore from '../../stores/ModalStore';

const ConfirmButtonsWrapper = styled.div`
  display: flex;
  gap: 10px;
  > button {
    width: 40px;
    font-size: 10px;
    font-weight: 800;
    background-color: #414141;
    border-style: none;
    border-radius: 10px;
    color: #fff;
    padding: 1px 0;
    cursor: pointer;
  }
`;

const ConfirmButtons = () => {
  const { setModalIsOpen, confirmFn, confirmFnParam } = useModalStore(
    (state) => ({
      setModalIsOpen: state.setModalIsOpen,
      confirmFn: state.confirmFn,
      confirmFnParam: state.confirmFnParam,
    }),
  );

  const cancelClickHandler = () => {
    setModalIsOpen();
  };

  const confirmClickHandler = () => {
    if (confirmFnParam) confirmFn(confirmFnParam);
    setModalIsOpen();
  };

  return (
    <ConfirmButtonsWrapper>
      <button onClick={confirmClickHandler}>확인</button>
      <button onClick={cancelClickHandler}>취소</button>
    </ConfirmButtonsWrapper>
  );
};

export default ConfirmButtons;
