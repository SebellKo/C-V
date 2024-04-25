import { styled } from 'styled-components';

import CommandList from './CommandList';
import NewCommandButton from './NewCommandButton';

const StyledMainContainer = styled.div`
  width: 100%;
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
