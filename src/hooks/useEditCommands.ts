import { useMutation } from '@tanstack/react-query';
import putEditCommands from '../api/putEditCommands';
import { useListStore } from '../stores/ListStore';
import type { CommandText } from '../types/domain';
import type { RuntimeResponse } from '../types/messages';

interface EditCommandsVariables {
  updatedCommands: CommandText[];
}

const useEditCommands = () => {
  const currentListName = useListStore((state) => state.currentListName);

  const { mutate: editCommandsMutate } = useMutation<
    RuntimeResponse<'edit-commands'>,
    Error,
    EditCommandsVariables
  >({
    mutationFn: ({ updatedCommands }) =>
      putEditCommands(currentListName, updatedCommands),
  });

  return { editCommandsMutate };
};

export default useEditCommands;
