import { styled } from 'styled-components';
import { DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';

import EditListItem from './EditListItem';

const EditList = ({ updatedList, setUpdatedList, onChange }) => {
  const handleDragEnd = ({ active, over }) => {
    if (over && active.id !== over.id) {
      const activeIndex = updatedList.findIndex(
        (item) => item.id === active.id,
      );
      const overIndex = updatedList.findIndex((item) => item.id === over.id);

      setUpdatedList(arrayMove(updatedList, activeIndex, overIndex));
      onChange();
    }
  };

  return (
    <EditListWrapper>
      <DndContext onDragEnd={handleDragEnd}>
        {updatedList.length === 0 && <h5>리스트가 없습니다.</h5>}
        <SortableContext items={updatedList.map((item) => item.id)}>
          {updatedList.map((listItem) => {
            return (
              <EditListItem
                listItem={listItem}
                key={listItem.id}
                setUpdatedList={setUpdatedList}
                onChange={onChange}
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
