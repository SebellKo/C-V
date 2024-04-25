import { styled } from 'styled-components';

import DeleteAllButton from './DeleteAllButton';

const StyledFooterContainer = styled.div`
  width: 100%;
  height: 5%;
  display: flex;
  justify-content: center;
`;

const FooterContainer = () => {
  return (
    <StyledFooterContainer>
      <DeleteAllButton></DeleteAllButton>
    </StyledFooterContainer>
  );
};

export default FooterContainer;
