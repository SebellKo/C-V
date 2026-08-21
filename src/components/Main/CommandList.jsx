import { styled } from 'styled-components';
import { DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';

import useEditCommands from '../../hooks/useEditCommands';
import useGetListById from '../../hooks/useGetListById';

import Command from './Command';
import { useListStore } from '../../stores/ListStore';

const CommandList = () => {
  const selectedListId = useListStore((state) => state.selectedListId);
  const [activeId, setActiveId] = useState();
  const [commandSnapshot, setCommandSnapshot] = useState({
    listId: null,
    commands: [],
  });
  const { editCommandsMutate } = useEditCommands();
  const { list, isSuccess } = useGetListById(selectedListId);

  useEffect(() => {
    if (isSuccess) {
      setCommandSnapshot({
        listId: selectedListId,
        commands: list.commands,
      });
    }
    if (selectedListId === null) {
      setCommandSnapshot({ listId: null, commands: [] });
    }
  }, [list, isSuccess, selectedListId]);

  const isCurrentSnapshot = commandSnapshot.listId === selectedListId;
  const commands = isCurrentSnapshot ? commandSnapshot.commands : [];

  const handleDragStart = ({ active }) => setActiveId(active.id);

  const handleDragEnd = ({ over }) => {
    if (over && activeId && isCurrentSnapshot) {
      const activeIndex = commands.findIndex(
        (commandItem) => commandItem === activeId,
      );
      const overIndex = commands.findIndex(
        (commandItem) => commandItem === over.id,
      );
      if (activeIndex !== -1 && overIndex !== -1) {
        const previousSnapshot = commandSnapshot;
        const updatedSnapshot = {
          listId: commandSnapshot.listId,
          commands: arrayMove(commands, activeIndex, overIndex),
        };
        setCommandSnapshot(updatedSnapshot);
        editCommandsMutate(
          {
            listId: updatedSnapshot.listId,
            updatedCommands: updatedSnapshot.commands,
          },
          {
            onError: () =>
              setCommandSnapshot((snapshot) =>
                snapshot === updatedSnapshot ? previousSnapshot : snapshot,
              ),
          },
        );
      }
    }
    setActiveId(null);
  };

  return (
    <StyledCommandList>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <SortableContext items={commands}>
          {commands &&
            commands.map((listItem, index) => (
              <Command
                key={index}
                listId={commandSnapshot.listId}
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
