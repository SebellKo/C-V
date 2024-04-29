import { styled } from 'styled-components';

import Command from './Command';
import { useListStore } from '../../stores/ListStore';

const StyledCommandList = styled.ul`
  width: 100%;
  height: 85%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  gap: 25px;
`;

const CommandList = () => {
  const { list, currentListName } = useListStore((state) => ({
    list: state.list,
    currentListName: state.currentListName,
  }));
  const listArr = Object.entries(list);
  const currentListArr = listArr.filter(
    (listItem) => listItem[0] === currentListName,
  );
  console.log(currentListArr);
  return (
    <StyledCommandList>
      <Command></Command>
    </StyledCommandList>
  );
};

export default CommandList;
