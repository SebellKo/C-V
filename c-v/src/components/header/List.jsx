import styled from 'styled-components';

import useListStore from '../../stores/ListStore';

const ListWrapper = styled.ul`
  position: absolute;
  z-index: 99;
  top: 30px;
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
  const { setListName, list } = useListStore((state) => ({
    setListName: state.setListName,
    list: state.list,
  }));
  const listItemNames = Object.keys(list);

  const clickHandler = (event) => {
    const selectName = event.target.innerText;
    setListName(selectName);
  };

  return (
    <ListWrapper onClick={clickHandler}>
      {listItemNames.map((listItem, index) => (
        <li key={index}>{listItem}</li>
      ))}
    </ListWrapper>
  );
};

export default List;
