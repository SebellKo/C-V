import { styled } from 'styled-components';

import Footer from './components/Footer/Footer';
import Main from './components/Main/Main';
import Header from './components/Header/Header';
import Modal from './components/Modal/Modal';

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
      {modalIsOpen && <Modal></Modal>}
      <AppContainer>
        <Header></Header>
        <Main></Main>
        <Footer></Footer>
      </AppContainer>
    </>
  );
}

export default App;
