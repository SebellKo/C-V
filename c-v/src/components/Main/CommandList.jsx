import { styled } from 'styled-components';
import { DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';

import useEditCommands from '../../hooks/useEditCommands';
import useGetListByName from '../../hooks/useGetListByName';

import Command from './Command';

const CommandList = () => {
  const [activeId, setActiveId] = useState();
  const [commands, setCommands] = useState([]);
  const { editCommandsMutate } = useEditCommands();
  const { list, isSuccess } = useGetListByName();

  useEffect(() => {
    if (isSuccess) setCommands(list.commands);
  }, [list, isSuccess]);

  const handleDragStart = ({ active }) => setActiveId(active.id);

  const handleDragEnd = ({ over }) => {
    if (over && activeId) {
      const activeIndex = commands.findIndex(
        (commandItem) => commandItem === activeId,
      );
      const overIndex = commands.findIndex(
        (commandItem) => commandItem === over.id,
      );
      const updatedCommands = arrayMove(commands, activeIndex, overIndex);
      editCommandsMutate({ updatedCommands: updatedCommands });
      setCommands(updatedCommands);
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
