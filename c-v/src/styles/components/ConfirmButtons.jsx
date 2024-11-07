import React from 'react';
import styled from 'styled-components';

function ConfirmButtons({ children }) {
  return <StyledConfirmButtons>{children}</StyledConfirmButtons>;
}

const StyledConfirmButtons = styled.div`
  display: flex;
  gap: 10px;
`;

export default ConfirmButtons;
