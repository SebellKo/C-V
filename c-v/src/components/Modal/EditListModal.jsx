import React from 'react';
import ModalCard from '../../styles/components/ModalCard';
import EditList from './EditList';
import ConfirmButtons from '../../styles/components/ConfirmButtons';
import Button from '../common/Button';

function EditListModal() {
  return (
    <ModalCard>
      <EditList></EditList>
      <ConfirmButtons>
        <Button>확인</Button>
        <Button>취소</Button>
      </ConfirmButtons>
    </ModalCard>
  );
}

export default EditListModal;
