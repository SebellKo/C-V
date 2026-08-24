import { styled } from 'styled-components';
import { DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { useState } from 'react';

import useEditCommands from '../../hooks/useEditCommands';

import Command from './Command';
import { useListStore } from '../../stores/ListStore';

const CommandList = () => {
  const lists = useListStore((state) => state.lists);
  const selectedListId = useListStore((state) => state.selectedListId);
  const [draggedCommand, setDraggedCommand] = useState(null);
  const { editCommands } = useEditCommands();
  const selectedList = lists.find((list) => list.id === selectedListId);
  const commands = selectedList?.commands ?? [];

  const handleDragStart = ({ active }) =>
    setDraggedCommand({ listId: selectedListId, command: active.id });

  const handleDragEnd = ({ over }) => {
    const isCurrentList = draggedCommand?.listId === selectedListId;
    setDraggedCommand(null);

    if (over && draggedCommand && isCurrentList) {
      const activeIndex = commands.findIndex(
        (command) => command === draggedCommand.command,
      );
      const overIndex = commands.findIndex(
        (command) => command === over.id,
      );
      if (activeIndex !== -1 && overIndex !== -1) {
        editCommands(
          selectedListId,
          arrayMove(commands, activeIndex, overIndex),
        ).catch((error) => console.error(error));
      }
    }
  };

  return (
    <StyledCommandList>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <SortableContext items={commands}>
          {commands &&
            commands.map((listItem, index) => (
              <Command
                key={index}
                listId={selectedListId}
                listItem={listItem}
                index={index}
              ></Command>
            ))}
        </SortableContext>
      </DndContext>
    </StyledCommandList>
  );
};

const StyledCommandList = styled.ul`
  width: 100%;
  height: 85%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  gap: 15px;
`;

export default CommandList;
