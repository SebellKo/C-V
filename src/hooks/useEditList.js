import { useMutation, useQueryClient } from '@tanstack/react-query';
import putEditList from '../api/putEditList';
import { useListStore } from '../stores/ListStore';
import { useEditListModalStore } from '../stores/ModalStore';
import {
  CURRENT_LIST_QUERY_KEY,
  LISTS_QUERY_KEY,
} from '../constants/queryKeys';

const useEditList = (setIsDuplicated) => {
  const closeEditModal = useEditListModalStore((state) => state.closeModal);
  const selectedListId = useListStore((state) => state.selectedListId);
  const setSelectedListId = useListStore(
    (state) => state.setSelectedListId,
  );
  const queryClient = useQueryClient();

  const { mutate: editListMutate } = useMutation({
    mutationFn: ({ updatedList }) => putEditList(updatedList),
    onSuccess: (data, { updatedList }) => {
      if (data.isDuplicated) return setIsDuplicated(true);

      const isSelectedListAvailable = updatedList.some(
        (listItem) => listItem.id === selectedListId,
      );
      const nextSelectedListId = isSelectedListAvailable
        ? selectedListId
        : null;

      setSelectedListId(nextSelectedListId);
      queryClient.setQueryData(
        CURRENT_LIST_QUERY_KEY,
        nextSelectedListId,
      );
      queryClient.invalidateQueries({ queryKey: LISTS_QUERY_KEY });
      closeEditModal();
    },
  });

  return { editListMutate };
};

export default useEditList;
