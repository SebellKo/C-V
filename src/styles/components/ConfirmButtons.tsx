import type { ReactNode } from 'react';
import styled from 'styled-components';

interface ConfirmButtonsProps {
  children: ReactNode;
}

function ConfirmButtons({ children }: ConfirmButtonsProps) {
  return <StyledConfirmButtons>{children}</StyledConfirmButtons>;
}

const StyledConfirmButtons = styled.div`
  display: flex;
  gap: 10px;
`;

export default ConfirmButtons;
