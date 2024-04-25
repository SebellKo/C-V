import { styled } from 'styled-components';

import CommandList from './CommandList';
import NewCommandButton from './NewCommandButton';

const StyledMainContainer = styled.div`
  width: 100%;
  height: 85%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const MainContainer = () => {
  return (
    <StyledMainContainer>
      <CommandList></CommandList>
      <NewCommandButton></NewCommandButton>
    </StyledMainContainer>
  );
};

export default MainContainer;
