import styled from 'styled-components';
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type MouseEvent,
  type SetStateAction,
} from 'react';

import { useListStore } from '../../stores/ListStore';
import useGetList from '../../hooks/useGetList';
import type { CommandList } from '../../types/domain';

interface ListProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const List = ({ isOpen, setIsOpen }: ListProps) => {
  const setListName = useListStore((state) => state.setListName);
  const [updatedList, setUpdatedList] = useState<CommandList[]>([]);
  const { list, isSuccess } = useGetList();
  const listItemRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleClickOthers = (event: globalThis.MouseEvent) => {
      if (
        listItemRef.current &&
        event.target instanceof Node &&
        !listItemRef.current.contains(event.target) &&
        isOpen
      )
        setIsOpen(false);
    };
    document.addEventListener('click', handleClickOthers);

    return () => document.removeEventListener('click', handleClickOthers);
  }, [isOpen, setIsOpen]);

  useEffect(() => {
    if (isSuccess) setUpdatedList(list);
  }, [list, isSuccess]);

  const handleClickItem = (event: MouseEvent<HTMLUListElement>) => {
    if (event.target instanceof HTMLLIElement) {
      setListName(event.target.innerText);
    }
  };

  return (
    <ListWrapper ref={listItemRef} onClick={(event) => handleClickItem(event)}>
      {updatedList.map((listItem, index) => (
        <li key={index}>{listItem.name}</li>
      ))}
    </ListWrapper>
  );
};

const ListWrapper = styled.ul`
  position: absolute;
  z-index: 9999;
  top: 30px;
  left: 5px;
  list-style: none;
  background-color: #000;
  border-radius: 5px;
  overflow-x: hidden;

  > li {
    max-width: 100px;
    padding: 3px 8px 4px 8px;
    border-bottom: 1px solid #ededed;
    color: #fff;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
  }
`;

export default List;
