import { useMutation, useQueryClient } from '@tanstack/react-query';
import deleteCommands from '../api/deleteCommands';
import { useDeleteConfirmModalStore } from '../stores/ModalStore';
import {
  getListQueryKey,
  LISTS_QUERY_KEY,
} from '../constants/queryKeys';

const useDeleteCommands = (listId) => {
  const queryClient = useQueryClient();
  const closeDeleteConfirmModal = useDeleteConfirmModalStore(
    (state) => state.closeModal,
  );

  const { mutate: deleteCommandsMutate } = useMutation({
    mutationFn: () => deleteCommands(listId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getListQueryKey(listId) });
      queryClient.invalidateQueries({
        queryKey: LISTS_QUERY_KEY,
        exact: true,
      });
      closeDeleteConfirmModal();
    },
  });

  return { deleteCommandsMutate };
};

export default useDeleteCommands;
