import styled from 'styled-components';

import Command from './Command';

const StyledCommandList = styled.ul`
  width: 100%;
  height: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  gap: 25px;
`;

const CommandList = () => {
  return (
    <StyledCommandList>
      <Command></Command>
      <Command></Command>
      <Command></Command>
      <Command></Command>
      <Command></Command>
    </StyledCommandList>
  );
};

export default CommandList;
