import { styled } from 'styled-components';

import FooterContainer from './components/Footer/FooterContainer';
import MainContainer from './components/Main/MainContainer';
import HeaderContainer from './components/Header/HeaderContainer';
import ModalContainer from './components/Modal/ModalContainer';

import useModalStore from './stores/ModalStore';

const AppContainer = styled.div`
  width: 100%;
  height: 96%;
  display: flex;
  padding: 2% 0;
  flex-direction: column;
  gap: 15px;
`;

function App() {
  const modalIsOpen = useModalStore((state) => state.modalIsOpen);

  return (
    <>
      {modalIsOpen && <ModalContainer></ModalContainer>}
      <AppContainer>
        <HeaderContainer></HeaderContainer>
        <MainContainer></MainContainer>
        <FooterContainer></FooterContainer>
      </AppContainer>
    </>
  );
}

export default App;
