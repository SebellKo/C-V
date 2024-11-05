import React from 'react';
import styled from 'styled-components';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import EditInput from './EditInput';
import deleteIcon from '../../../assets/images/delete-black.svg';
import dragDropIcon from '../../../assets/images/drag-drop.svg';

function EditListItem({
  updatedList,
  setUpdatedList,
  value,
  index,
  setIsDuplicated,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: value });

  const handleChangeInput = (event, index) => {
    const inputValue = event.target.value;
    const convertedList = [...updatedList];
    convertedList[index].name = inputValue;
    setUpdatedList(convertedList);
    setIsDuplicated(false);
  };

  const handleClickDelete = (listName) => {
    const deletedList = updatedList.filter(
      (listItem) => listItem.name !== listName,
    );
    setUpdatedList(deletedList);
  };

  return (
    <Item
      ref={setNodeRef}
      {...attributes}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
        zIndex: isDragging ? '100' : undefined,
      }}
    >
      <img
        src={dragDropIcon}
        alt="drag icon"
        ref={setActivatorNodeRef}
        {...listeners}
      />
      <EditInput
        value={value}
        onChange={(event) => handleChangeInput(event, index)}
      ></EditInput>
      <img
        src={deleteIcon}
        alt="delete icon"
        onClick={() => handleClickDelete(value)}
      />
    </Item>
  );
}

const Item = styled.li`
  display: flex;
  gap: 10px;

  > img {
    width: 8px;
    cursor: pointer;
  }
`;

export default EditListItem;
