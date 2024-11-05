import { styled } from 'styled-components';

import DeleteAllButton from './DeleteAllButton';

const Footer = () => {
  return (
    <FooterContainer>
      <DeleteAllButton></DeleteAllButton>
    </FooterContainer>
  );
};

const FooterContainer = styled.div`
  width: 100%;
  height: 5%;
  display: flex;
  justify-content: center;
`;

export default Footer;
