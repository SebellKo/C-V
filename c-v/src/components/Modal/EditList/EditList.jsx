import { styled } from 'styled-components';
import { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';

import EditListItem from './EditListItem';

const EditList = ({ updatedList, setUpdatedList }) => {
  const [activeId, setActiveId] = useState();

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
  };
  const handleDragEnd = ({ over }) => {
    if (over && activeId) {
      const activeIndex = updatedList.findIndex(
        (item) => item.name === activeId,
      );
      const overIndex = updatedList.findIndex((item) => item.name === over.id);
      const updatedArr = arrayMove(updatedList, activeIndex, overIndex);

      setUpdatedList(updatedArr);
    }
    setActiveId(null);
  };

  return (
    <EditListWrapper>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {updatedList.length === 0 && <h5>리스트가 없습니다.</h5>}
        <SortableContext items={updatedList.map((item) => item.name)}>
          {updatedList.map((listItem, index) => {
            return (
              <EditListItem
                value={listItem.name}
                key={listItem.id}
                index={index}
                updatedList={updatedList}
                setUpdatedList={setUpdatedList}
              />
            );
          })}
        </SortableContext>
      </DndContext>
    </EditListWrapper>
  );
};

const EditListWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  list-style: none;
`;

export default EditList;
