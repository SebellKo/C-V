import React from 'react';
import styled from 'styled-components';

function Button({ children, onClick }) {
  return <StyledButton onClick={onClick}>{children}</StyledButton>;
}

const StyledButton = styled.button`
  width: 40px;
  font-size: 10px;
  font-weight: 800;
  background-color: #414141;
  border-style: none;
  border-radius: 10px;
  color: #fff;
  padding: 1px 0;
  cursor: pointer;
`;

export default Button;
