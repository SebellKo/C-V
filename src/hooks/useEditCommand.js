import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useListStore } from '../stores/ListStore';
import putEditCommand from '../api/putEditCommand';
import useCommandStore from '../stores/CommandStore';
import { useEditCommandModalStore } from '../stores/ModalStore';
import {
  getListQueryKey,
  LISTS_QUERY_KEY,
} from '../constants/queryKeys';

const useEditCommand = (setIsDuplicated) => {
  const selectedListId = useListStore((state) => state.selectedListId);
  const resetSelectedCommand = useCommandStore(
    (state) => state.resetSelectedCommand,
  );
  const closeEditCommandModal = useEditCommandModalStore(
    (state) => state.closeModal,
  );
  const queryClient = useQueryClient();

  const { mutate: editCommandMutate } = useMutation({
    mutationFn: ({ selectedCommand, newCommandValue }) =>
      putEditCommand(selectedListId, selectedCommand, newCommandValue),
    onSuccess: (data) => {
      if (data.isDuplicated) return setIsDuplicated(true);
      resetSelectedCommand();
      closeEditCommandModal();
      queryClient.invalidateQueries({
        queryKey: getListQueryKey(selectedListId),
      });
      queryClient.invalidateQueries({
        queryKey: LISTS_QUERY_KEY,
        exact: true,
      });
    },
  });

  return { editCommandMutate };
};

export default useEditCommand;
