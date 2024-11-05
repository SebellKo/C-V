import React, { useEffect, useState } from 'react';

import { useEditListModalStore } from '../../stores/ModalStore';
import useEditList from '../../hooks/useEditList';
import useGetList from '../../hooks/useGetList';

import ModalCard from '../../styles/components/ModalCard';
import EditList from './EditList/EditList';
import ConfirmButtons from '../../styles/components/ConfirmButtons';
import Button from '../common/Button';

function EditListModal() {
  const closeEditModal = useEditListModalStore((state) => state.closeModal);
  const [updatedList, setUpdatedList] = useState([]);
  const { editListMutate } = useEditList();
  const { list, isSuccess } = useGetList();

  useEffect(() => {
    if (isSuccess) setUpdatedList(list);
  }, [list, isSuccess]);

  const handleClickConfirm = () => editListMutate({ updatedList: updatedList });

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
