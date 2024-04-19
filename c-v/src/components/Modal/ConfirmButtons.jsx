import styled from 'styled-components';

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
  return (
    <ConfirmButtonsWrapper>
      <button>확인</button>
      <button>취소</button>
    </ConfirmButtonsWrapper>
  );
};

export default ConfirmButtons;
