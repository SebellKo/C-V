import { useMutation, useQueryClient } from '@tanstack/react-query';
import postCommand from '../api/postCommand';
import { useAddCommandModalStore } from '../stores/ModalStore';
import { useListStore } from '../stores/ListStore';

const useAddCommand = (setIsDuplicated, setIsFull) => {
  const currentListName = useListStore((state) => state.currentListName);
  const closeAddCommandModal = useAddCommandModalStore(
    (state) => state.closeModal,
  );
  const queryClient = useQueryClient();

  const { mutate: addCommandMutate } = useMutation({
    mutationFn: ({ newCommand }) => postCommand(newCommand, currentListName),
    onSuccess: (data) => {
      if (data.isDuplicated) return setIsDuplicated(true);
      if (data.isFull) return setIsFull(true);
      queryClient.invalidateQueries({ queryKey: ['list', currentListName] });
      closeAddCommandModal();
    },
    onError: (error) => console.log(error),
  });

  return { addCommandMutate };
};

export default useAddCommand;
