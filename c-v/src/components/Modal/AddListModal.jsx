import React, { useState } from 'react';
import styled from 'styled-components';
import { useAddListModalStore } from '../../stores/ModalStore';
import ModalCard from '../../styles/components/ModalCard';
import Button from '../common/Button';
import EditInput from './EditInput';
import { useListStore } from '../../stores/ListStore';

function AddListModal() {
  const [listTitle, setListTitle] = useState('');
  const closeAddModal = useAddListModalStore((state) => state.closeModal);
  const addListItem = useListStore((state) => state.addListItem);

  const handleClickConrifm = () => {
    addListItem(listTitle);
    closeAddModal();
  };

  return (
    <ModalCard>
      <ModalTitle>리스트 제목을 입력해 주세요</ModalTitle>
      <EditInput
        onChange={(event) => setListTitle(event.target.value)}
      ></EditInput>
      <ConfirmButtons>
        <Button onClick={handleClickConrifm}>확인</Button>
        <Button onClick={closeAddModal}>취소</Button>
      </ConfirmButtons>
    </ModalCard>
  );
}

const ConfirmButtons = styled.div`
  display: flex;
  gap: 10px;
`;

export default AddListModal;
