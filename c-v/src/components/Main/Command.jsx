import { styled } from 'styled-components';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import dragDropIcon from '../../assets/images/drag-drop-icon.svg';
import deleteIcon from '../../assets/images/delete-white.svg';
import { useListStore } from '../../stores/ListStore';

const CommandWrapper = styled.li`
  width: 250px;
  ${({ $isDragging }) => $isDragging && 'opacity: 0.5'}
  position: relative;
  z-index: 99;
`;

const CommandHeader = styled.div`
  position: relative;
  z-index: 0;
  width: 100%;
  padding: 2px 3% 2px 3%;
  display: flex;
  background-color: #aeaeae;
  justify-content: space-between;
  border-radius: 5px 5px 0 0;
  border-top: 1px solid #d9d9d9;
  border-left: 1px solid #d9d9d9;
  border-right: 1px solid #d9d9d9;

  > h5 {
    color: #fff;
    font-size: 12px;
  }
  > img {
    cursor: pointer;
  }
`;

const CommandContent = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({ $isOver }) => ($isOver ? '#00B3FF' : '#d9d9d9')};
  border-radius: 0 0 5px 5px;
  > p {
    width: 80%;
    font-size: 11px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    cursor: pointer;
  }
`;

const Command = ({ listItem }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: listItem });
  const removeCommand = useListStore((state) => state.removeCommand);
  const currentListName = useListStore((state) => state.currentListName);

  const command = listItem;

  const handleClickDeleteIcon = () => {
    removeCommand({ currentListName: currentListName, command: command });
  };

  return (
    <CommandWrapper
      ref={setNodeRef}
      {...attributes}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
        zIndex: isDragging ? '100' : undefined,
      }}
    >
      <CommandHeader>
        <img
          src={dragDropIcon}
          alt="drag icon"
          ref={setActivatorNodeRef}
          {...listeners}
        />
        <h5>{`command`}</h5>
        <img
          src={deleteIcon}
          alt="close icon"
          onClick={handleClickDeleteIcon}
        />
      </CommandHeader>
      <CommandContent>
        <p>{command}</p>
      </CommandContent>
    </CommandWrapper>
  );
};

export default Command;
