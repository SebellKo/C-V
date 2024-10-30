import React, { useState } from 'react';
import ModalCard from '../../styles/components/ModalCard';
import EditList from './EditList';
import ConfirmButtons from '../../styles/components/ConfirmButtons';
import Button from '../common/Button';
import { useListStore } from '../../stores/ListStore';
import { useEditListModalStore } from '../../stores/ModalStore';

function EditListModal() {
  const list = useListStore((state) => state.list);
  const copyList = list.map((item) => ({ ...item }));
  const modifyList = useListStore((state) => state.modifyList);
  const closeEditModal = useEditListModalStore((state) => state.closeModal);
  const [updatedList, setUpdatedList] = useState(copyList);

  const handleClickConfirm = () => {
    modifyList(updatedList);
    closeEditModal();
  };

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
