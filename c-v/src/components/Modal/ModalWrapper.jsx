import styled from 'styled-components';
import ConfirmButtons from './ConfirmButtons';
import EditInput from './EditInput';
import ConfirmText from './ConfirmText';
import EditList from './EditList';
import { useListStore } from '../../stores/ListStore';

const ModalCardContainer = styled.div`
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

const ModalCard = () => {
  const addListItem = useListStore((state) => state.addListItem);
  const modifyList = useListStore((state) => state.modifyList);

  return (
    <ModalCardContainer>
      {modalType === 'input' && <EditInput></EditInput>}
      {modalType === 'text' && <ConfirmText></ConfirmText>}
      {modalType === 'list' && <EditList></EditList>}
      <ConfirmButtons></ConfirmButtons>
    </ModalCardContainer>
  );
};

export default ModalCard;
