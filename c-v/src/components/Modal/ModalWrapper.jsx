import styled from 'styled-components';
import ConfirmButtons from './ConfirmButtons';
import EditInput from './EditInput';
import ConfirmText from './ConfirmText';
import EditList from './EditList';

const StyledModalWrapper = styled.div`
  width: 230px;
  padding: 25px 0 15px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  border: 1px solid #414141;
  border-radius: 5px;
  background-color: #fff;
`;

const ModalWrapper = () => {
  return (
    <StyledModalWrapper>
      <EditInput></EditInput>
      <ConfirmText></ConfirmText>
      <EditList></EditList>
      <ConfirmButtons></ConfirmButtons>
    </StyledModalWrapper>
  );
};

export default ModalWrapper;
