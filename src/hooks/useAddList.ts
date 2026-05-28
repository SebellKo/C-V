import type { Dispatch, SetStateAction } from 'react';
import { useMutation } from '@tanstack/react-query';
import postList from '../api/postList';
import { useAddListModalStore } from '../stores/ModalStore';
import type { ListName } from '../types/domain';
import type { RuntimeResponse } from '../types/messages';

interface AddListVariables {
  listTitle: ListName;
}

type BooleanSetter = Dispatch<SetStateAction<boolean>>;

const useAddList = (
  setIsDuplicated: BooleanSetter,
  setIsFull: BooleanSetter,
) => {
  const closeAddModal = useAddListModalStore((state) => state.closeModal);

  const { mutate: addListMutate } = useMutation<
    RuntimeResponse<'add-list'>,
    Error,
    AddListVariables
  >({
    mutationFn: ({ listTitle }) => postList(listTitle),
    onSuccess: (data) => {
      if ('isDuplicated' in data) return setIsDuplicated(true);
      if ('isFull' in data) return setIsFull(true);
      closeAddModal();
    },
  });

  return { addListMutate };
};

export default useAddList;
