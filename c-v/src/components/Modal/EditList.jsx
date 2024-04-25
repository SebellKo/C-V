import styled from 'styled-components';

import deleteIcon from '../../assets/images/delete-black.svg';
import dragDropIcon from '../../assets/images/drag-drop.svg';
import EditInput from './EditInput';

const EditListWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  list-style: none;
  > li {
    display: flex;
    gap: 10px;
    > img {
      width: 8px;
      cursor: pointer;
    }
  }
`;

const EditList = () => {
  return (
    <EditListWrapper>
      <li>
        <img src={dragDropIcon} alt="drag icon" />
        <EditInput />
        <img src={deleteIcon} alt="delete icon" />
      </li>
      <li>
        <img src={dragDropIcon} alt="drag icon" />
        <EditInput />
        <img src={deleteIcon} alt="delete icon" />
      </li>
    </EditListWrapper>
  );
};

export default EditList;
