import React, { useState } from 'react';

import { useAddListModalStore } from '../../stores/ModalStore';
import useAddList from '../../hooks/useAddList';

import ModalCard from '../../styles/components/ModalCard';
import ModalTitle from '../../styles/components/ModalTitle';
import Button from '../common/Button';
import EditInput from './EditList/EditInput';
import ConfirmButtons from '../../styles/components/ConfirmButtons';

function AddListModal() {
  const [listTitle, setListTitle] = useState('');
  const closeAddModal = useAddListModalStore((state) => state.closeModal);
  const { addListMutate } = useAddList();

  const handleClickConrifm = () => addListMutate(listTitle);

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
