import styled, { styped } from 'styled-components';

import FooterContainer from './components/Footer/FooterContainer';
import MainContainer from './components/Main/MainContainer';
import HeaderContainer from './components/header/HeaderContainer';

const AppContainer = styled.div`
  width: 100%;
  height: 96%;
  display: flex;
  padding: 2% 0;
  flex-direction: column;
  gap: 15px;
`;

function App() {
  return (
    <AppContainer>
      <HeaderContainer></HeaderContainer>
      <MainContainer></MainContainer>
      <FooterContainer></FooterContainer>
    </AppContainer>
  );
}

export default App;
