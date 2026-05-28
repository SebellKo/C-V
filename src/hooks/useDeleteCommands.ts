import { useMutation, useQueryClient } from '@tanstack/react-query';
import deleteCommands from '../api/deleteCommands';
import { useDeleteConfirmModalStore } from '../stores/ModalStore';
import type { ListName } from '../types/domain';
import type { RuntimeResponse } from '../types/messages';

const useDeleteCommands = (currentListName: ListName) => {
  const queryClient = useQueryClient();
  const closeDeleteConfirmModal = useDeleteConfirmModalStore(
    (state) => state.closeModal,
  );

  const { mutate: deleteCommandsMutate } = useMutation<
    RuntimeResponse<'delete-commands'>,
    Error,
    void
  >({
    mutationFn: () => deleteCommands(currentListName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list', currentListName] });
      closeDeleteConfirmModal();
    },
  });

  return { deleteCommandsMutate };
};

export default useDeleteCommands;
