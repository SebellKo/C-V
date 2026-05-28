import type { MouseEventHandler, ReactNode } from 'react';
import styled from 'styled-components';

interface ButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

function Button({ children, onClick }: ButtonProps) {
  return <StyledButton onClick={onClick}>{children}</StyledButton>;
}

const StyledButton = styled.button`
  width: 40px;
  font-size: 10px;
  font-weight: 800;
  background-color: #000;
  border-style: none;
  border-radius: 10px;
  color: #fff;
  padding: 1px 0;
  cursor: pointer;
`;

export default Button;
