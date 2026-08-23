import styled from 'styled-components';
import { useState } from 'react';

import { useListStore } from '../../stores/ListStore';

import openButtonIcon from '../../assets/images/open-button.svg';
import List from './List';

const SelectButton = () => {
  const lists = useListStore((state) => state.lists);
  const selectedListId = useListStore((state) => state.selectedListId);
  const select = useListStore((state) => state.select);
  const [isOpen, setIsOpen] = useState(false);

  const selectList = async (listId) => {
    setIsOpen(false);

    try {
      await select(listId);
    } catch (error) {
      console.error(error);
    }
  };

  const selectedListName =
    lists.find((list) => list.id === selectedListId)?.name ?? 'Select';

  const handleClickSelect = (event) => {
    event.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  return (
    <SelectButtonWrapper
      $isOpen={isOpen}
      onClick={(event) => handleClickSelect(event)}
    >
      <ListName>{selectedListName}</ListName>
      <img src={openButtonIcon} alt="" />
      {isOpen && (
        <List list={lists} onSelect={selectList} setIsOpen={setIsOpen} />
      )}
    </SelectButtonWrapper>
  );
};

const SelectButtonWrapper = styled.div`
  position: relative;
  display: flex;
  padding: 5px 10px;
  gap: 10px;
  background-color: #000;
  border-radius: 15px;
  cursor: pointer;

  > img {
    transform: ${({ $isOpen }) =>
      $isOpen ? 'rotateZ(180deg)' : 'rotateZ(0deg)'};
  }
`;

const ListName = styled.span`
  max-width: 100px;
  color: #fff;
  font-weight: 500;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export default SelectButton;
