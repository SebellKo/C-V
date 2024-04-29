import styled from 'styled-components';
import ConfirmButtons from './ConfirmButtons';
import EditInput from './EditInput';
import ConfirmText from './ConfirmText';
import EditList from './EditList';
import useModalStore from '../../stores/ModalStore';
import useListStore from '../../stores/ListStore';

const StyledModalWrapper = styled.div`
  width: 230px;
  padding: 25px 0 15px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  border: 1px solid #414141;
  border-radius: 5px;
  background-color: #fff;
`;

const ModalWrapper = () => {
  const { modalType, setConfirmFn } = useModalStore((state) => ({
    modalType: state.modalType,
    setConfirmFn: state.setConfirmFn,
  }));

  const addListItem = useListStore((state) => state.addListItem);

  if (modalType === 'input') setConfirmFn(addListItem);

  return (
    <StyledModalWrapper>
      {modalType === 'input' && <EditInput></EditInput>}
      {modalType === 'text' && <ConfirmText></ConfirmText>}
      {modalType === 'list' && <EditList></EditList>}
      <ConfirmButtons></ConfirmButtons>
    </StyledModalWrapper>
  );
};

export default ModalWrapper;
