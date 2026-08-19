import { styled } from 'styled-components';
import { DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';

import useEditCommands from '../../hooks/useEditCommands';
import useGetListByName from '../../hooks/useGetListByName';

import Command from './Command';
import { useListStore } from '../../stores/ListStore';

const CommandList = () => {
  const currentListName = useListStore((state) => state.currentListName);
  const [activeId, setActiveId] = useState();
  const [commandSnapshot, setCommandSnapshot] = useState({
    listName: 'Select',
    commands: [],
  });
  const { editCommandsMutate } = useEditCommands();
  const { list, isSuccess } = useGetListByName(currentListName);

  useEffect(() => {
    if (isSuccess) {
      setCommandSnapshot({
        listName: currentListName,
        commands: list.commands,
      });
    }
    if (currentListName === 'Select') {
      setCommandSnapshot({ listName: currentListName, commands: [] });
    }
  }, [list, isSuccess, currentListName]);

  const isCurrentSnapshot = commandSnapshot.listName === currentListName;
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
          listName: commandSnapshot.listName,
          commands: arrayMove(commands, activeIndex, overIndex),
        };
        setCommandSnapshot(updatedSnapshot);
        editCommandsMutate(
          {
            listName: updatedSnapshot.listName,
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
                listName={commandSnapshot.listName}
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
