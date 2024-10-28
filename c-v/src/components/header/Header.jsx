import styled from 'styled-components';

import SelectButton from './SelectButton';
import ModifyButtons from './ModifyButtons';

const HeaderConatiner = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: 10px;
`;

const HeaderContainer = () => {
  return (
    <HeaderConatiner>
      <SelectButton></SelectButton>
      <ModifyButtons></ModifyButtons>
    </HeaderConatiner>
  );
};

export default HeaderContainer;
