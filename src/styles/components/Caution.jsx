import React from 'react';
import styled from 'styled-components';

function Caution({ children }) {
  return <Desc>{children}</Desc>;
}

const Desc = styled.p`
  font-size: 10px;
  color: #e82a36;
`;

export default Caution;
