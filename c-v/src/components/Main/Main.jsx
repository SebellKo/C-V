import { styled } from 'styled-components';

import CommandList from './CommandList';
import NewCommandButton from './NewCommandButton';
import { useAddListModalStore } from '../../stores/ModalStore';
import AddListModal from '../Modal/AddListModal';
import Modal from '../Modal/Modal';

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
  const { isOpen: isAddModalOpen, closeModal: closeAddListModal } =
    useAddListModalStore();

  return (
    <>
      <MainContainer>
        <CommandList></CommandList>
        <NewCommandButton></NewCommandButton>
      </MainContainer>
      {isAddModalOpen && (
        <Modal onClose={closeAddListModal}>
          <AddListModal></AddListModal>
        </Modal>
      )}
    </>
  );
};

export default Main;
