import { styled } from 'styled-components';

import CommandList from './CommandList';
import NewCommandButton from './NewCommandButton';

const MainContainer = styled.div`
  width: 100%;
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const Main = () => {
  return (
    <MainContainer>
      <CommandList></CommandList>
      <NewCommandButton></NewCommandButton>
    </MainContainer>
  );
};

export default Main;
