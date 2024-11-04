import React, { useEffect, useState } from 'react';
import ModalCard from '../../styles/components/ModalCard';
import EditList from './EditList';
import ConfirmButtons from '../../styles/components/ConfirmButtons';
import Button from '../common/Button';
import { useEditListModalStore } from '../../stores/ModalStore';
import { useListStore } from '../../stores/ListStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import getList from '../../api/getList';
import putEditList from '../../api/putEditList';

function EditListModal() {
  const closeEditModal = useEditListModalStore((state) => state.closeModal);
  const setListName = useListStore((state) => state.setListName);
  const [updatedList, setUpdatedList] = useState([]);

  const { data: list, isSuccess } = useQuery({
    queryFn: getList,
    queryKey: ['list'],
  });

  const { mutate: editListMutate } = useMutation({
    mutationFn: () => putEditList(updatedList),
    onSuccess: () => {
      setListName('Select');
      closeEditModal();
    },
  });

  useEffect(() => {
    if (isSuccess) setUpdatedList(list);
  }, [list, isSuccess]);

  const handleClickConfirm = () => editListMutate();

  return (
    <ModalCard>
      <EditList
        updatedList={updatedList}
        setUpdatedList={setUpdatedList}
      ></EditList>
      <ConfirmButtons>
        <Button onClick={handleClickConfirm}>확인</Button>
        <Button onClick={closeEditModal}>취소</Button>
      </ConfirmButtons>
    </ModalCard>
  );
}

export default EditListModal;
