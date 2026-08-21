import { useMutation, useQueryClient } from '@tanstack/react-query';
import postList from '../api/postList';
import { useAddListModalStore } from '../stores/ModalStore';
import { LISTS_QUERY_KEY } from '../constants/queryKeys';

const useAddList = (setIsDuplicated, setIsFull, setIsInvalidName) => {
  const closeAddModal = useAddListModalStore((state) => state.closeModal);
  const queryClient = useQueryClient();

  const { mutate: addListMutate } = useMutation({
    mutationFn: ({ listTitle }) => postList(listTitle),
    onSuccess: (data) => {
      if (data.isDuplicated) return setIsDuplicated(true);
      if (data.isFull) return setIsFull(true);
      if (data.isInvalidName) return setIsInvalidName(true);
      queryClient.invalidateQueries({ queryKey: LISTS_QUERY_KEY });
      closeAddModal();
    },
  });

  return { addListMutate };
};

export default useAddList;
