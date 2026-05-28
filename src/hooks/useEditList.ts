import type { Dispatch, SetStateAction } from 'react';
import { useMutation } from '@tanstack/react-query';
import putEditList from '../api/putEditList';
import { useListStore } from '../stores/ListStore';
import { useEditListModalStore } from '../stores/ModalStore';
import type { CommandList } from '../types/domain';
import type { RuntimeResponse } from '../types/messages';

interface EditListVariables {
  updatedList: CommandList[];
}

const useEditList = (
  setIsDuplicated: Dispatch<SetStateAction<boolean>>,
) => {
  const closeEditModal = useEditListModalStore((state) => state.closeModal);
  const setListName = useListStore((state) => state.setListName);

  const { mutate: editListMutate } = useMutation<
    RuntimeResponse<'edit-list'>,
    Error,
    EditListVariables
  >({
    mutationFn: ({ updatedList }) => putEditList(updatedList),
    onSuccess: (data) => {
      if ('isDuplicated' in data) return setIsDuplicated(true);
      setListName('Select');
      closeEditModal();
    },
  });

  return { editListMutate };
};

export default useEditList;
