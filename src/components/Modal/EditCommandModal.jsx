import React, { useState } from 'react';

import useCommandStore from '../../stores/CommandStore';
import { useEditCommandModalStore } from '../../stores/ModalStore';
import useEditCommand from '../../hooks/useEditCommand';

import ModalCard from '../../styles/components/ModalCard';
import ModalTitle from '../../styles/components/ModalTitle';
import ConfirmButtons from '../../styles/components/ConfirmButtons';
import Button from '../common/Button';
import EditInput from './EditList/EditInput';
import Caution from '../../styles/components/Caution';

function EditCommandModal() {
  const [isDuplicated, setIsDuplicated] = useState(false);
  const selectedCommand = useCommandStore((state) => state.selectedCommand);
  const resetSelectedCommand = useCommandStore(
    (state) => state.resetSelectedCommand,
  );
  const closeEditCommandModal = useEditCommandModalStore(
    (state) => state.closeModal,
  );
  const [newCommandValue, setNewCommandValue] = useState(selectedCommand);
  const { editCommandMutate } = useEditCommand(setIsDuplicated);

  const handleChangeCommand = (event) => {
    const inputValue = event.target.value;
    setNewCommandValue(inputValue);
    setIsDuplicated(false);
  };

  const handleClickConfirm = () => {
    editCommandMutate({
      selectedCommand: selectedCommand,
      newCommandValue: newCommandValue,
    });
  };

  const handleClickCancel = () => {
    resetSelectedCommand();
    closeEditCommandModal();
  };

  return (
    <ModalCard>
      <ModalTitle>커맨드 수정</ModalTitle>
      <EditInput
        value={newCommandValue}
        onChange={(event) => handleChangeCommand(event)}
      ></EditInput>
      {isDuplicated && <Caution>중복된 커맨드 입니다</Caution>}
      <ConfirmButtons>
        <Button onClick={handleClickConfirm}>확인</Button>
        <Button onClick={handleClickCancel}>취소</Button>
      </ConfirmButtons>
    </ModalCard>
  );
}

export default EditCommandModal;
