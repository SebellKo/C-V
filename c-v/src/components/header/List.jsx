import styled from 'styled-components';

import { useListStore } from '../../stores/ListStore';

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

const List = () => {
  const setListName = useListStore((state) => state.setListName);
  const list = useListStore((state) => state.list);

  const clickHandler = (event) => {
    const selectName = event.target.innerText;
    setListName(selectName);
  };

  return (
    <ListWrapper onClick={clickHandler}>
      {list.map((listItem, index) => (
        <li key={index}>{listItem.name}</li>
      ))}
    </ListWrapper>
  );
};

export default List;
