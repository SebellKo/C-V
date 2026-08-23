import { styled } from 'styled-components';
import { useEffect } from 'react';

import Footer from './components/Footer/Footer';
import Main from './components/Main/Main';
import Header from './components/header/Header';
import { useListStore } from './stores/ListStore';
import GlobalStyles from './styles/GlobalStyle';

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  padding: 2% 0;
  flex-direction: column;
  gap: 15px;
`;

function App() {
  const load = useListStore((state) => state.load);

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

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
