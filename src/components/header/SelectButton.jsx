import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useListStore } from '../../stores/ListStore';
import useGetCurrentListId from '../../hooks/useGetCurrentListId';
import useGetList from '../../hooks/useGetList';
import setCurrentListId from '../../api/setCurrentListId';
import { CURRENT_LIST_QUERY_KEY } from '../../constants/queryKeys';

import openButtonIcon from '../../assets/images/open-button.svg';
import List from './List';

const SelectButton = () => {
  const selectedListId = useListStore((state) => state.selectedListId);
  const setSelectedListId = useListStore(
    (state) => state.setSelectedListId,
  );
  const [isOpen, setIsOpen] = useState(false);
  const { currentListId, isSuccess: isCurrentListSuccess } =
    useGetCurrentListId();
  const { list = [] } = useGetList();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isCurrentListSuccess) {
      setSelectedListId(currentListId);
    }
  }, [currentListId, isCurrentListSuccess, setSelectedListId]);

  const { mutate: selectList } = useMutation({
    mutationFn: setCurrentListId,
    onSuccess: (_data, listId) => {
      setSelectedListId(listId);
      queryClient.setQueryData(CURRENT_LIST_QUERY_KEY, listId);
      setIsOpen(false);
    },
  });

  const selectedListName =
    list.find((listItem) => listItem.id === selectedListId)?.name ?? 'Select';

  const handleClickSelect = (event) => {
    event.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  return (
    <SelectButtonWrapper
      $isOpen={isOpen}
      onClick={(event) => handleClickSelect(event)}
    >
      <ListName>{selectedListName}</ListName>
      <img src={openButtonIcon} alt="" />
      {isOpen && (
        <List list={list} onSelect={selectList} setIsOpen={setIsOpen} />
      )}
    </SelectButtonWrapper>
  );
};

const SelectButtonWrapper = styled.div`
  position: relative;
  display: flex;
  padding: 5px 10px;
  gap: 10px;
  background-color: #000;
  border-radius: 15px;
  cursor: pointer;

  > img {
    transform: ${({ $isOpen }) =>
      $isOpen ? 'rotateZ(180deg)' : 'rotateZ(0deg)'};
  }
`;

const ListName = styled.span`
  max-width: 100px;
  color: #fff;
  font-weight: 500;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export default SelectButton;
