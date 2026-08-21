import React, { useEffect, useRef, useState } from 'react';

import { useEditListModalStore } from '../../stores/ModalStore';
import useEditList from '../../hooks/useEditList';
import useGetList from '../../hooks/useGetList';

import ModalCard from '../../styles/components/ModalCard';
import EditList from './EditList/EditList';
import ConfirmButtons from '../../styles/components/ConfirmButtons';
import Button from '../common/Button';
import Caution from '../../styles/components/Caution';

const createMetadataPatch = (initialList, updatedList) => {
  const initialNamesById = new Map(
    initialList.map(({ id, name }) => [id, name]),
  );
  const updatedOrder = updatedList.map(({ id }) => id);
  const updatedIds = new Set(updatedOrder);
  const deletedIds = initialList
    .filter(({ id }) => !updatedIds.has(id))
    .map(({ id }) => id);
  const deletedIdSet = new Set(deletedIds);
  const initialRemainingOrder = initialList
    .filter(({ id }) => !deletedIdSet.has(id))
    .map(({ id }) => id);
  const isOrderChanged = updatedOrder.some(
    (id, index) => id !== initialRemainingOrder[index],
  );

  return {
    orderedIds: isOrderChanged ? updatedOrder : [],
    renamedLists: updatedList.filter(
      ({ id, name }) => initialNamesById.get(id) !== name,
    ),
    deletedIds,
  };
};

function EditListModal() {
  const closeEditModal = useEditListModalStore((state) => state.closeModal);
  const initialListRef = useRef(null);
  const [updatedList, setUpdatedList] = useState([]);
  const [isDuplicated, setIsDuplicated] = useState(false);
  const [isInvalidName, setIsInvalidName] = useState(false);
  const { editListMutate } = useEditList(
    setIsDuplicated,
    setIsInvalidName,
  );
  const { list, isSuccess } = useGetList();

  useEffect(() => {
    if (isSuccess && initialListRef.current === null) {
      const listMetadata = list.map(({ id, name }) => ({ id, name }));
      initialListRef.current = listMetadata;
      setUpdatedList(listMetadata.map((item) => ({ ...item })));
    }
  }, [list, isSuccess]);

  const resetErrors = () => {
    setIsDuplicated(false);
    setIsInvalidName(false);
  };

  const handleClickConfirm = () =>
    editListMutate(
      createMetadataPatch(initialListRef.current ?? [], updatedList),
    );

  return (
    <ModalCard>
      <EditList
        updatedList={updatedList}
        setUpdatedList={setUpdatedList}
        onChange={resetErrors}
      ></EditList>
      {isDuplicated && <Caution>중복된 리스트가 있습니다</Caution>}
      {isInvalidName && <Caution>리스트 이름을 확인해주세요</Caution>}
      <ConfirmButtons>
        <Button onClick={handleClickConfirm}>확인</Button>
        <Button onClick={closeEditModal}>취소</Button>
      </ConfirmButtons>
    </ModalCard>
  );
}

export default EditListModal;
