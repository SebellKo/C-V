import React, { useState } from 'react';
import ModalCard from '../../styles/components/ModalCard';
import ModalTitle from '../../styles/components/ModalTitle';
import ConfirmButtons from '../../styles/components/ConfirmButtons';
import Button from '../common/Button';
import EditInput from './EditInput';
import { useListStore } from '../../stores/ListStore';
import { useAddCommandModalStore } from '../../stores/ModalStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import postCommand from '../../api/postCommand';

function AddCommandModal() {
  const [newCommand, setNewCommand] = useState();
  const currentListName = useListStore((state) => state.currentListName);
  const closeAddCommandModal = useAddCommandModalStore(
    (state) => state.closeModal,
  );
  const queryClient = useQueryClient();

  const { mutate: addCommand } = useMutation({
    mutationFn: () => postCommand(newCommand, currentListName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list', currentListName] });
      closeAddCommandModal();
    },
    onError: (error) => console.log(error),
  });

  const handleChangeInput = (event) => {
    const inputValue = event.target.value;
    setNewCommand(inputValue);
  };

  const handleClickConfirm = () => addCommand();

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
