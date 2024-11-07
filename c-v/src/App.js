import { styled } from 'styled-components';

import Footer from './components/Footer/Footer';
import Main from './components/Main/Main';
import Header from './components/Header/Header';
import GlobalStyles from './styles/GlobalStyle';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const AppContainer = styled.div`
  width: 100%;
  height: 96%;
  display: flex;
  padding: 2% 0;
  flex-direction: column;
  gap: 15px;
`;

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <GlobalStyles></GlobalStyles>
      <QueryClientProvider client={queryClient}>
        <AppContainer>
          <Header></Header>
          <Main></Main>
          <Footer></Footer>
        </AppContainer>
      </QueryClientProvider>
    </>
  );
}

export default App;
