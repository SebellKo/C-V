import { useMutation, useQueryClient } from '@tanstack/react-query';
import deleteCommands from '../api/deleteCommands';
import { useDeleteConfirmModalStore } from '../../stores/ModalStore';

const useDeleteCommands = (currentListName) => {
  const queryClient = useQueryClient();
  const closeDeleteConfirmModal = useDeleteConfirmModalStore(
    (state) => state.closeModal,
  );

  const { mutate: deleteCommandsMutate } = useMutation({
    mutationFn: () => deleteCommands(currentListName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list', currentListName] });
      closeDeleteConfirmModal();
    },
  });

  return { deleteCommandsMutate };
};

export default useDeleteCommands;
