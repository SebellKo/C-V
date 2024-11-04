import React, { useState } from 'react';
import { useAddListModalStore } from '../../stores/ModalStore';
import ModalCard from '../../styles/components/ModalCard';
import ModalTitle from '../../styles/components/ModalTitle';
import Button from '../common/Button';
import EditInput from './EditInput';
import ConfirmButtons from '../../styles/components/ConfirmButtons';
import { useMutation } from '@tanstack/react-query';
import postList from '../../api/postList';

function AddListModal() {
  const [listTitle, setListTitle] = useState('');
  const closeAddModal = useAddListModalStore((state) => state.closeModal);

  const { mutate: addListMutate } = useMutation({
    mutationFn: () => postList(listTitle),
    onSuccess: () => closeAddModal(),
  });

  const handleClickConrifm = () => addListMutate();

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
