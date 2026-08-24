import { styled } from 'styled-components';
import { useEffect } from 'react';

import Footer from './components/Footer/Footer';
import Main from './components/Main/Main';
import Header from './components/header/Header';
import getCurrentListId from './api/getCurrentListId';
import getList from './api/getList';
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
  const initialize = useListStore((state) => state.initialize);

  useEffect(() => {
    Promise.all([getList(), getCurrentListId()])
      .then(([lists, selectedListId]) => initialize(lists, selectedListId))
      .catch((error) => console.error(error));
  }, [initialize]);

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
