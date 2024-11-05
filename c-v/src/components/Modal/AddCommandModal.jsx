import React, { useState } from 'react';

import useAddCommand from '../../hooks/useAddCommand';
import { useAddCommandModalStore } from '../../stores/ModalStore';

import ModalCard from '../../styles/components/ModalCard';
import ModalTitle from '../../styles/components/ModalTitle';
import ConfirmButtons from '../../styles/components/ConfirmButtons';
import Button from '../common/Button';
import EditInput from './EditList/EditInput';

function AddCommandModal() {
  const [newCommand, setNewCommand] = useState();
  const closeAddCommandModal = useAddCommandModalStore(
    (state) => state.closeModal,
  );
  const { addCommandMutate } = useAddCommand();

  const handleChangeInput = (event) => {
    const inputValue = event.target.value;
    setNewCommand(inputValue);
  };

  const handleClickConfirm = () => addCommandMutate({ newCommand: newCommand });

  return (
    <ModalCard>
      <ModalTitle>새로운 커맨드를 입력해주세요</ModalTitle>
      <EditInput onChange={(event) => handleChangeInput(event)}></EditInput>
      <ConfirmButtons>
        <Button onClick={handleClickConfirm}>확인</Button>
        <Button onClick={closeAddCommandModal}>취소</Button>
      </ConfirmButtons>
    </ModalCard>
  );
}

export default AddCommandModal;
