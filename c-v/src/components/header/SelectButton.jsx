import styled from 'styled-components';

import { useListStore, useListUiStore } from '../../stores/ListStore';
import openButtonIcon from '../../assets/images/open-button.svg';

const SelectButtonWrapper = styled.div`
  display: flex;
  padding: 5px 10px;
  gap: 10px;
  background-color: #45454d;
  border-radius: 15px;
  cursor: pointer;
`;

const ListName = styled.span`
  color: #fff;
  font-weight: 500;
  font-size: 13px;
`;

const SelectButton = () => {
  const currentListName = useListStore((state) => state.currentListName);
  const toggleClick = useListUiStore((state) => state.toggleClick);

  const clickHandler = () => {
    toggleClick();
  };
  return (
    <SelectButtonWrapper onClick={clickHandler}>
      <ListName>{currentListName}</ListName>
      <img src={openButtonIcon}></img>
    </SelectButtonWrapper>
  );
};

export default SelectButton;
