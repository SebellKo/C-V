import React from 'react';
import styled from 'styled-components';

import { useListStore } from '../../stores/ListStore';
import { useDeleteConfirmModalStore } from '../../stores/ModalStore';
import useDeleteCommands from '../../hooks/useDeleteCommands';

import ModalCard from '../../styles/components/ModalCard';
import ModalTitle from '../../styles/components/ModalTitle';
import ConfirmButtons from '../../styles/components/ConfirmButtons';
import Button from '../common/Button';
import Caution from '../../styles/components/Caution';

function DeleteConfirmModal() {
  const currentListName = useListStore((state) => state.currentListName);
  const closeDeleteConfirmModal = useDeleteConfirmModalStore(
    (state) => state.closeModal,
  );
  const { deleteCommandsMutate } = useDeleteCommands(currentListName);

  const handleClickConfirm = () => deleteCommandsMutate();

  return (
    <ModalCard>
      <ModalTitle>"{currentListName}" 리스트를 삭제 하시겠습니까 ?</ModalTitle>
      <Caution>저장된 모든 커맨드들이 삭제됩니다</Caution>
      <ConfirmButtons>
        <Button onClick={handleClickConfirm}>확인</Button>
        <Button onClick={closeDeleteConfirmModal}>취소</Button>
      </ConfirmButtons>
    </ModalCard>
  );
}

export default DeleteConfirmModal;
