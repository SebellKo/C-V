import type { Dispatch, SetStateAction } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import postCommand from '../api/postCommand';
import { useAddCommandModalStore } from '../stores/ModalStore';
import { useListStore } from '../stores/ListStore';
import type { CommandText } from '../types/domain';
import type { RuntimeResponse } from '../types/messages';

interface AddCommandVariables {
  newCommand: CommandText;
}

type BooleanSetter = Dispatch<SetStateAction<boolean>>;

const useAddCommand = (
  setIsDuplicated: BooleanSetter,
  setIsFull: BooleanSetter,
) => {
  const currentListName = useListStore((state) => state.currentListName);
  const closeAddCommandModal = useAddCommandModalStore(
    (state) => state.closeModal,
  );
  const queryClient = useQueryClient();

  const { mutate: addCommandMutate } = useMutation<
    RuntimeResponse<'add-new-command'>,
    Error,
    AddCommandVariables
  >({
    mutationFn: ({ newCommand }) => postCommand(newCommand, currentListName),
    onSuccess: (data) => {
      if ('isDuplicated' in data) return setIsDuplicated(true);
      if ('isFull' in data) return setIsFull(true);
      queryClient.invalidateQueries({ queryKey: ['list', currentListName] });
      closeAddCommandModal();
    },
    onError: (error) => console.log(error),
  });

  return { addCommandMutate };
};

export default useAddCommand;
