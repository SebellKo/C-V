import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAddListModalStore } from '../../stores/ModalStore';
import ModalCard from '../../styles/components/ModalCard';
import ModalTitle from '../../styles/components/ModalTitle';
import Button from '../common/Button';
import EditInput from './EditInput';
import ConfirmButtons from '../../styles/components/ConfirmButtons';
import { useListStore } from '../../stores/ListStore';

function AddListModal() {
  const [listTitle, setListTitle] = useState('');
  const closeAddModal = useAddListModalStore((state) => state.closeModal);
  const addListItem = useListStore((state) => state.addListItem);

  const handleClickConrifm = () => {
    chrome.runtime.sendMessage({
      type: 'add-list',
      message: { listName: listTitle, id: uuidv4() },
    });
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

export default AddListModal;
