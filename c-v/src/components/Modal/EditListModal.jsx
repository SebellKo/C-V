import React, { useEffect, useState } from 'react';
import ModalCard from '../../styles/components/ModalCard';
import EditList from './EditList';
import ConfirmButtons from '../../styles/components/ConfirmButtons';
import Button from '../common/Button';
import { useListStore } from '../../stores/ListStore';
import { useEditListModalStore } from '../../stores/ModalStore';

function EditListModal() {
  const closeEditModal = useEditListModalStore((state) => state.closeModal);
  const [updatedList, setUpdatedList] = useState([]);

  useEffect(() => {
    chrome.runtime
      .sendMessage({ type: 'get-list' })
      .then((response) => setUpdatedList(response.listData));
  }, []);

  const handleClickConfirm = () => {
    chrome.runtime.sendMessage({
      type: 'edit-list',
      message: { newList: updatedList },
    });
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
