import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';

import { useListStore } from '../../stores/ListStore';
import useGetList from '../../hooks/useGetList';

const List = ({ isOpen, setIsOpen }) => {
  const setListName = useListStore((state) => state.setListName);
  const [updatedList, setUpdatedList] = useState([]);
  const { list, isSuccess } = useGetList();
  const listItemRef = useRef(null);

  useEffect(() => {
    const handleClickOthers = (event) => {
      if (
        listItemRef.current &&
        !listItemRef.current.contains(event.target) &&
        isOpen
      )
        setIsOpen(false);
    };
    document.addEventListener('click', (event) => handleClickOthers(event));

    return () =>
      document.removeEventListener('click', (event) => handleClickItem(event));
  }, []);

  useEffect(() => {
    if (isSuccess) setUpdatedList(list);
  }, [list, isSuccess]);

  const handleClickItem = (event) => {
    const selectName = event.target.innerText;
    setListName(selectName);
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
  background-color: #45454d;
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
