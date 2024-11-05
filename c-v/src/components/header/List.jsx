import styled from 'styled-components';
import { useEffect, useState } from 'react';

import { useListStore } from '../../stores/ListStore';
import useGetList from '../../hooks/useGetList';

const List = () => {
  const setListName = useListStore((state) => state.setListName);
  const [updatedList, setUpdatedList] = useState([]);
  const { list, isSuccess } = useGetList();

  useEffect(() => {
    if (isSuccess) setUpdatedList(list);
  }, [list, isSuccess]);

  const clickHandler = (event) => {
    const selectName = event.target.innerText;
    setListName(selectName);
  };

  return (
    <ListWrapper onClick={clickHandler}>
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
    padding: 3px 8px 4px 8px;
    border-bottom: 1px solid #ededed;
    color: #fff;
    font-size: 12px;
    cursor: pointer;
  }
`;

export default List;
