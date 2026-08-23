import React, { useState } from 'react';

import { useAddListModalStore } from '../../stores/ModalStore';
import useAddList from '../../hooks/useAddList';

import ModalCard from '../../styles/components/ModalCard';
import ModalTitle from '../../styles/components/ModalTitle';
import Button from '../common/Button';
import EditInput from './EditList/EditInput';
import ConfirmButtons from '../../styles/components/ConfirmButtons';
import Caution from '../../styles/components/Caution';

function AddListModal() {
  const [isDuplicated, setIsDuplicated] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [isInvalidName, setIsInvalidName] = useState(false);
  const [listTitle, setListTitle] = useState('');
  const closeAddModal = useAddListModalStore((state) => state.closeModal);
  const { addList } = useAddList();

  const handleClickConrifm = async () => {
    try {
      const result = await addList(listTitle);
      if (result.isDuplicated) return setIsDuplicated(true);
      if (result.isFull) return setIsFull(true);
      if (result.isInvalidName) return setIsInvalidName(true);
      closeAddModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeInput = (event) => {
    const inputValue = event.target.value;
    setListTitle(inputValue);
    setIsDuplicated(false);
    setIsFull(false);
    setIsInvalidName(false);
  };

  return (
    <ModalCard>
      <ModalTitle>리스트 이름을 입력해 주세요</ModalTitle>
      <EditInput onChange={(event) => handleChangeInput(event)}></EditInput>
      {isDuplicated && <Caution>중복된 리스트 입니다</Caution>}
      {isFull && <Caution>리스트는 10개까지 생성 가능합니다</Caution>}
      {isInvalidName && <Caution>리스트 이름을 확인해주세요</Caution>}
      <ConfirmButtons>
        <Button onClick={handleClickConrifm}>확인</Button>
        <Button onClick={closeAddModal}>취소</Button>
      </ConfirmButtons>
    </ModalCard>
  );
}

export default AddListModal;
