import { styled } from 'styled-components';
import { DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import Command from './Command';
import { useListStore } from '../../stores/ListStore';
import { useState } from 'react';

const StyledCommandList = styled.ul`
  width: 100%;
  height: 85%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  gap: 15px;
`;

const CommandList = () => {
  const currentListName = useListStore((state) => state.currentListName);
  const modifyCommands = useListStore((state) => state.modifyCommands);
  const list = useListStore((state) => state.list);
  const [currentList] = list.filter(
    (listItem) => listItem.name === currentListName,
  );
  const [activeId, setActiveId] = useState();

  const commands = currentList ? currentList.commands : [];

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
  };

  const handleDragEnd = ({ over }) => {
    if (over && activeId) {
      const activeIndex = commands.findIndex(
        (commandItem) => commandItem === activeId,
      );
      const overIndex = commands.findIndex(
        (commandItem) => commandItem === over.id,
      );
      const updatedCommands = arrayMove(commands, activeIndex, overIndex);
      modifyCommands({ id: currentList.id, commands: updatedCommands });
    }
    setActiveId(null);
  };

  return (
    <StyledCommandList>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <SortableContext items={commands}>
          {commands &&
            commands.map((listItem, index) => (
              <Command key={index} listItem={listItem} index={index}></Command>
            ))}
        </SortableContext>
      </DndContext>
    </StyledCommandList>
  );
};

export default CommandList;
