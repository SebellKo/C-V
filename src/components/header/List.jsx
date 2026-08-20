import styled from 'styled-components';
import { useEffect, useRef } from 'react';

const List = ({ list, onSelect, setIsOpen }) => {
  const listItemRef = useRef(null);

  useEffect(() => {
    const handleClickOthers = (event) => {
      if (
        listItemRef.current &&
        !listItemRef.current.contains(event.target)
      )
        setIsOpen(false);
    };
    document.addEventListener('click', handleClickOthers);

    return () => document.removeEventListener('click', handleClickOthers);
  }, [setIsOpen]);

  return (
    <ListWrapper ref={listItemRef} onClick={(event) => event.stopPropagation()}>
      {list.map((listItem) => (
        <li key={listItem.id} onClick={() => onSelect(listItem.id)}>
          {listItem.name}
        </li>
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
