import React from 'react';
import styled from 'styled-components';

function ModalTitle({ children }) {
  return <Title>{children}</Title>;
}

const Title = styled.h1`
  color: #000;
  font-size: 12px;
  font-weight: 600;
`;

export default ModalTitle;
