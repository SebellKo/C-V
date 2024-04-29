import { styled } from 'styled-components';

import ModalWrapper from './ModalWrapper';

const StyledModalContainer = styled.div`
  position: absolute;
  z-index: 999;
  width: 100%;
  height: 380px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = () => {
  return (
    <StyledModalContainer>
      <ModalWrapper></ModalWrapper>
    </StyledModalContainer>
  );
};

export default ModalContainer;
