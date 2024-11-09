import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useListStore } from '../stores/ListStore';
import putEditCommand from '../api/putEditCommand';
import useCommandStore from '../stores/CommandStore';
import { useEditCommandModalStore } from '../stores/ModalStore';

const useEditCommand = (setIsDuplicated) => {
  const currentListName = useListStore((state) => state.currentListName);
  const resetSelectedCommand = useCommandStore(
    (state) => state.resetSelectedCommand,
  );
  const closeEditCommandModal = useEditCommandModalStore(
    (state) => state.closeModal,
  );
  const queryClient = useQueryClient();

  const { mutate: editCommandMutate } = useMutation({
    mutationFn: ({ selectedCommand, newCommandValue }) =>
      putEditCommand(currentListName, selectedCommand, newCommandValue),
    onSuccess: (data) => {
      if (data.isDuplicated) return setIsDuplicated(true);
      resetSelectedCommand();
      closeEditCommandModal();
      queryClient.invalidateQueries({ queryKey: ['list', currentListName] });
    },
  });

  return { editCommandMutate };
};

export default useEditCommand;
