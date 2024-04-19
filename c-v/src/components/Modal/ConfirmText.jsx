import styled from 'styled-components';

const StyledConfirmText = styled.p`
  font-size: 10px;
  font-weight: 600;
`;

const ConfirmText = () => {
  return <StyledConfirmText>전체 삭제 하시겠습니까 ?</StyledConfirmText>;
};

export default ConfirmText;
