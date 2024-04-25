import styled from 'styled-components';
import HeaderContainer from './components/header/HeaderContainer';

const AppContainer = styled.div`
  width: 300px;
  height: 380px;
  border: 1px solid #e8e7e7;
  border-radius: 5px;
  padding: 10px 20px;
`;

function App() {
  return (
    <AppContainer>
      <HeaderContainer></HeaderContainer>
    </AppContainer>
  );
}

export default App;
