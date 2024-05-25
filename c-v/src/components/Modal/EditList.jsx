import { styled } from 'styled-components';
import { useEffect, useState } from 'react';

import deleteIcon from '../../assets/images/delete-black.svg';
import dragDropIcon from '../../assets/images/drag-drop.svg';
import EditInput from './EditInput';
import { useListStore } from '../../stores/ListStore';
import useModalStore from '../../stores/ModalStore';

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
  const list = useListStore((state) => state.list);
  const listArr = Object.entries(list);

  const [updatedList, setUpdatedList] = useState(listArr);
  const setConfirmFnParam = useModalStore((state) => state.setConfirmFnParam);

  useEffect(() => {
    const convertedList = updatedList.reduce((acc, cur) => {
      acc[cur[0]] = cur[1];
      return acc;
    }, {});

    setConfirmFnParam(convertedList);
  }, [updatedList]);

  const handleClickDelete = (listName) => {
    const deletedList = updatedList.filter(
      (listItem) => listItem[0] !== listName,
    );
    setUpdatedList(deletedList);
  };

  return (
    <EditListWrapper>
      {updatedList.length === 0 && <h5>리스트가 없습니다.</h5>}
      {updatedList.map((listItem) => {
        return (
          <li>
            <img src={dragDropIcon} alt="drag icon" />
            <EditInput value={listItem[0]} />
            <img
              src={deleteIcon}
              alt="delete icon"
              onClick={() => handleClickDelete(listItem[0])}
            />
          </li>
        );
      })}
    </EditListWrapper>
  );
};

export default EditList;
