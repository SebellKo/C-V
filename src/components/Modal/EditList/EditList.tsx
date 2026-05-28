import { styled } from 'styled-components';
import {
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';

import EditListItem from './EditListItem';
import type { CommandList, ListName } from '../../../types/domain';

interface EditListProps {
  updatedList: CommandList[];
  setUpdatedList: Dispatch<SetStateAction<CommandList[]>>;
  setIsDuplicated: Dispatch<SetStateAction<boolean>>;
}

const EditList = ({
  updatedList,
  setUpdatedList,
  setIsDuplicated,
}: EditListProps) => {
  const [activeId, setActiveId] = useState<ListName | null>(null);

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(String(active.id));
  };
  const handleDragEnd = ({ over }: DragEndEvent) => {
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
                setIsDuplicated={setIsDuplicated}
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
