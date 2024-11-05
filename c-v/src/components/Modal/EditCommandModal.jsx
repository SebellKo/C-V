import React, { useState } from 'react';

import useCommandStore from '../../stores/CommandStore';
import { useEditCommandModalStore } from '../../stores/ModalStore';
import useEditCommand from '../../hooks/useEditCommand';

import ModalCard from '../../styles/components/ModalCard';
import ModalTitle from '../../styles/components/ModalTitle';
import ConfirmButtons from '../../styles/components/ConfirmButtons';
import Button from '../common/Button';
import EditInput from '../Modal/EditInput';

function EditCommandModal() {
  const selectedCommand = useCommandStore((state) => state.selectedCommand);
  const resetSelectedCommand = useCommandStore(
    (state) => state.resetSelectedCommand,
  );
  const closeEditCommandModal = useEditCommandModalStore(
    (state) => state.closeModal,
  );
  const [newCommandValue, setNewCommandValue] = useState(selectedCommand);
  const { editCommandMutate } = useEditCommand();

  const handleChangeCommand = (event) => {
    const inputValue = event.target.value;
    setNewCommandValue(inputValue);
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
      <ConfirmButtons>
        <Button onClick={handleClickConfirm}>확인</Button>
        <Button onClick={handleClickCancel}>취소</Button>
      </ConfirmButtons>
    </ModalCard>
  );
}

export default EditCommandModal;
