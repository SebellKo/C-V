import { styled } from 'styled-components';
import Command from './Command';

const StyledCommandList = styled.ul`
  width: 100%;
  height: 85%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  gap: 15px;
`;

const currentListArr = ['apple', 'pineapple'];

const CommandList = () => {
  return (
    <StyledCommandList>
      {currentListArr &&
        currentListArr.map((listItem, index) => (
          <Command
            key={index}
            listItem={listItem}
            currentList={currentListArr}
            index={index}
          ></Command>
        ))}
    </StyledCommandList>
  );
};

export default CommandList;
