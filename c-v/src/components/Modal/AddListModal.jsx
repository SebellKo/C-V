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
  const [listTitle, setListTitle] = useState('');
  const closeAddModal = useAddListModalStore((state) => state.closeModal);
  const { addListMutate } = useAddList(setIsDuplicated);

  const handleClickConrifm = () => addListMutate({ listTitle: listTitle });

  const handleChangeInput = (event) => {
    const inputValue = event.target.value;
    setListTitle(inputValue);
    setIsDuplicated(false);
  };

  return (
    <ModalCard>
      <ModalTitle>리스트 이름을 입력해 주세요</ModalTitle>
      <EditInput onChange={(event) => handleChangeInput(event)}></EditInput>
      {isDuplicated && <Caution>중복된 리스트 입니다</Caution>}
      <ConfirmButtons>
        <Button onClick={handleClickConrifm}>확인</Button>
        <Button onClick={closeAddModal}>취소</Button>
      </ConfirmButtons>
    </ModalCard>
  );
}

export default AddListModal;
