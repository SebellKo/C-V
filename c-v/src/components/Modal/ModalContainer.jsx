import { styled } from 'styled-components';

import ModalWrapper from './ModalWrapper';

const StyledModalContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 2%;
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
