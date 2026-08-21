import { useMutation, useQueryClient } from '@tanstack/react-query';
import putEditList from '../api/putEditList';
import { useListStore } from '../stores/ListStore';
import { useEditListModalStore } from '../stores/ModalStore';
import {
  CURRENT_LIST_QUERY_KEY,
  LISTS_QUERY_KEY,
} from '../constants/queryKeys';

const useEditList = (setIsDuplicated, setIsInvalidName) => {
  const closeEditModal = useEditListModalStore((state) => state.closeModal);
  const selectedListId = useListStore((state) => state.selectedListId);
  const setSelectedListId = useListStore(
    (state) => state.setSelectedListId,
  );
  const queryClient = useQueryClient();

  const { mutate: editListMutate } = useMutation({
    mutationFn: putEditList,
    onSuccess: (data, { deletedIds }) => {
      if (data.isDuplicated) return setIsDuplicated(true);
      if (data.isInvalidName) return setIsInvalidName(true);

      const nextSelectedListId = deletedIds.includes(selectedListId)
        ? null
        : selectedListId;

      setSelectedListId(nextSelectedListId);
      queryClient.setQueryData(
        CURRENT_LIST_QUERY_KEY,
        nextSelectedListId,
      );
      queryClient.invalidateQueries({ queryKey: CURRENT_LIST_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: LISTS_QUERY_KEY });
      closeEditModal();
    },
  });

  return { editListMutate };
};

export default useEditList;
