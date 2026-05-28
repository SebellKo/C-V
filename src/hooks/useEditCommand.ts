import type { Dispatch, SetStateAction } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useListStore } from '../stores/ListStore';
import putEditCommand from '../api/putEditCommand';
import useCommandStore from '../stores/CommandStore';
import { useEditCommandModalStore } from '../stores/ModalStore';
import type { CommandText } from '../types/domain';
import type { RuntimeResponse } from '../types/messages';

interface EditCommandVariables {
  selectedCommand: CommandText;
  newCommandValue: CommandText;
}

const useEditCommand = (
  setIsDuplicated: Dispatch<SetStateAction<boolean>>,
) => {
  const currentListName = useListStore((state) => state.currentListName);
  const resetSelectedCommand = useCommandStore(
    (state) => state.resetSelectedCommand,
  );
  const closeEditCommandModal = useEditCommandModalStore(
    (state) => state.closeModal,
  );
  const queryClient = useQueryClient();

  const { mutate: editCommandMutate } = useMutation<
    RuntimeResponse<'edit-command'>,
    Error,
    EditCommandVariables
  >({
    mutationFn: ({ selectedCommand, newCommandValue }) =>
      putEditCommand(currentListName, selectedCommand, newCommandValue),
    onSuccess: (data) => {
      if ('isDuplicated' in data) return setIsDuplicated(true);
      resetSelectedCommand();
      closeEditCommandModal();
      queryClient.invalidateQueries({ queryKey: ['list', currentListName] });
    },
  });

  return { editCommandMutate };
};

export default useEditCommand;
