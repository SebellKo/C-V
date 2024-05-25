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

  > img {
    transform: ${(props) =>
      props.$isClick ? 'rotateZ(180deg)' : 'rotateZ(0deg)'};
  }
`;

const ListName = styled.span`
  color: #fff;
  font-weight: 500;
  font-size: 13px;
`;

const SelectButton = () => {
  const list = useListStore((state) => state.list);
  const currentListName = useListStore((state) => state.currentListName);
  const { toggleClick, isClick } = useListUiStore((state) => ({
    toggleClick: state.toggleClick,
    isClick: state.isClick,
  }));

  const clickHandler = () => {
    toggleClick();
  };
  return (
    <SelectButtonWrapper $isClick={isClick} onClick={clickHandler}>
      <ListName>
        {Object.keys(list).length === 0 ? 'Select' : currentListName}
      </ListName>
      <img src={openButtonIcon}></img>
    </SelectButtonWrapper>
  );
};

export default SelectButton;
