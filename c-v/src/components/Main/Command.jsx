import { styled } from 'styled-components';

import dragDropIcon from '../../assets/images/drag-drop-icon.svg';
import deleteIcon from '../../assets/images/delete-white.svg';

const CommandWrapper = styled.li`
  width: 250px;
  height: 60px;
`;

const CommandHeader = styled.div`
  width: 94%;
  padding: 2px 3% 2px 3%;
  display: flex;
  background-color: #aeaeae;
  justify-content: space-between;
  border-radius: 5px 5px 0 0;
  border-top: 1px solid #d9d9d9;
  border-left: 1px solid #d9d9d9;
  border-right: 1px solid #d9d9d9;

  > h5 {
    color: #fff;
    font-size: 12px;
  }
  > img {
    cursor: pointer;
  }
`;

const CommandContent = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #d9d9d9;
  border-radius: 0 0 5px 5px;
  > p {
    width: 80%;
    font-size: 11px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
  }
`;

const Command = () => {
  return (
    <CommandWrapper draggable="true">
      <CommandHeader>
        <img draggable="false" src={dragDropIcon} alt="drag-drop icon" />
        <h5>command 1</h5>
        <img draggable="false" src={deleteIcon} alt="close icon" />
      </CommandHeader>
      <CommandContent>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor Lorem ipsum dolor sit amet, consectetur adipiscing
          elit, sed do eiusmod tempor Lorem ipsum dolor sit amet, consectetur
          adipiscing elit, sed do eiusmod tempor
        </p>
      </CommandContent>
    </CommandWrapper>
  );
};

export default Command;
