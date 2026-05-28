import type { ReactNode } from 'react';
import styled from 'styled-components';

interface ModalTitleProps {
  children: ReactNode;
}

function ModalTitle({ children }: ModalTitleProps) {
  return <Title>{children}</Title>;
}

const Title = styled.h1`
  color: #000;
  font-size: 12px;
  font-weight: 600;
`;

export default ModalTitle;
