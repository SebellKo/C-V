import styled from 'styled-components';

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
  return (
    <SelectButtonWrapper>
      <ListName>New</ListName>
      <img src={openButtonIcon}></img>
    </SelectButtonWrapper>
  );
};

export default SelectButton;
