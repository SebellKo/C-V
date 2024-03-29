import styled from 'styled-components';
import SelectButton from './SelectButton';
import ModifyButtons from './ModifyButtons';
import List from './List';

const HeaderConatiner = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const HeaderContainer = () => {
  return (
    <HeaderConatiner>
      <SelectButton></SelectButton>
      <ModifyButtons></ModifyButtons>
      <List></List>
    </HeaderConatiner>
  );
};

export default HeaderContainer;
