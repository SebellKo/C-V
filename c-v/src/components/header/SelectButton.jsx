import styled from 'styled-components';

import { useListStore } from '../../stores/ListStore';
import openButtonIcon from '../../assets/images/open-button.svg';
import List from './List';
import { useState } from 'react';

const SelectButtonWrapper = styled.div`
  position: relative;
  display: flex;
  padding: 5px 10px;
  gap: 10px;
  background-color: #45454d;
  border-radius: 15px;
  cursor: pointer;

  > img {
    transform: ${({ $isOpen }) =>
      $isOpen ? 'rotateZ(180deg)' : 'rotateZ(0deg)'};
  }
`;

const ListName = styled.span`
  color: #fff;
  font-weight: 500;
  font-size: 13px;
`;

const SelectButton = () => {
  const currentListName = useListStore((state) => state.currentListName);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SelectButtonWrapper
      $isOpen={isOpen}
      onClick={() => setIsOpen((prev) => !prev)}
    >
      <ListName>{currentListName}</ListName>
      <img src={openButtonIcon}></img>
      {isOpen && <List setIsOpen={setIsOpen}></List>}
    </SelectButtonWrapper>
  );
};

export default SelectButton;
