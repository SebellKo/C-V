import styled from 'styled-components';

import SelectButton from './SelectButton';
import ModifyButtons from './ModifyButtons';
import List from './List';

import useListStore from '../../stores/ListStore';

const HeaderConatiner = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const HeaderContainer = () => {
  const { isClick } = useListStore();

  return (
    <HeaderConatiner>
      <SelectButton></SelectButton>
      <ModifyButtons></ModifyButtons>
      {isClick && <List></List>}
    </HeaderConatiner>
  );
};

export default HeaderContainer;
