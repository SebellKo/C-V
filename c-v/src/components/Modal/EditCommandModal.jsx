import React, { useState } from 'react';
import ModalCard from '../../styles/components/ModalCard';
import ModalTitle from '../../styles/components/ModalTitle';
import ConfirmButtons from '../../styles/components/ConfirmButtons';
import Button from '../common/Button';
import EditInput from '../Modal/EditInput';
import useCommandStore from '../../stores/CommandStore';
import { useEditCommandModalStore } from '../../stores/ModalStore';
import { useListStore } from '../../stores/ListStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import putEditCommand from '../../api/putEditCommand';

function EditCommandModal() {
  const currentListName = useListStore((state) => state.currentListName);
  const selectedCommand = useCommandStore((state) => state.selectedCommand);
  const resetSelectedCommand = useCommandStore(
    (state) => state.resetSelectedCommand,
  );
  const closeEditCommandModal = useEditCommandModalStore(
    (state) => state.closeModal,
  );
  const [newCommandValue, setNewCommandValue] = useState(selectedCommand);
  const queryClient = useQueryClient();

  const { mutate: editCommandMutate } = useMutation({
    mutationFn: () =>
      putEditCommand(currentListName, selectedCommand, newCommandValue),
    onSuccess: () => {
      resetSelectedCommand();
      closeEditCommandModal();
      queryClient.invalidateQueries({ queryKey: ['list', currentListName] });
    },
  });

  const handleChangeCommand = (event) => {
    const inputValue = event.target.value;
    setNewCommandValue(inputValue);
  };

  const handleClickConfirm = () => {
    editCommandMutate();
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
