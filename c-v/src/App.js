import { styled } from 'styled-components';

import Footer from './components/Footer/Footer';
import Main from './components/Main/Main';
import Header from './components/Header/Header';
import GlobalStyles from './styles/GlobalStyle';

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
    <>
      <GlobalStyles></GlobalStyles>
      <AppContainer>
        <Header></Header>
        <Main></Main>
        <Footer></Footer>
      </AppContainer>
    </>
  );
}

export default App;
