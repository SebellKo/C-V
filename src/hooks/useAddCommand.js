import { useMutation, useQueryClient } from '@tanstack/react-query';
import postCommand from '../api/postCommand';
import { useAddCommandModalStore } from '../stores/ModalStore';
import { useListStore } from '../stores/ListStore';
import {
  getListQueryKey,
  LISTS_QUERY_KEY,
} from '../constants/queryKeys';

const useAddCommand = (setIsDuplicated, setIsFull) => {
  const selectedListId = useListStore((state) => state.selectedListId);
  const closeAddCommandModal = useAddCommandModalStore(
    (state) => state.closeModal,
  );
  const queryClient = useQueryClient();

  const { mutate: addCommandMutate } = useMutation({
    mutationFn: ({ newCommand }) => postCommand(newCommand, selectedListId),
    onSuccess: (data) => {
      if (data.isDuplicated) return setIsDuplicated(true);
      if (data.isFull) return setIsFull(true);
      queryClient.invalidateQueries({
        queryKey: getListQueryKey(selectedListId),
      });
      queryClient.invalidateQueries({
        queryKey: LISTS_QUERY_KEY,
        exact: true,
      });
      closeAddCommandModal();
    },
    onError: (error) => console.log(error),
  });

  return { addCommandMutate };
};

export default useAddCommand;
