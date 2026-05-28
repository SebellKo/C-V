import type { ReactNode } from 'react';
import styled from 'styled-components';

interface CautionProps {
  children: ReactNode;
}

function Caution({ children }: CautionProps) {
  return <Desc>{children}</Desc>;
}

const Desc = styled.p`
  font-size: 10px;
  color: #e82a36;
`;

export default Caution;
