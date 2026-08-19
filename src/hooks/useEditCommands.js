import { useMutation } from '@tanstack/react-query';
import putEditCommands from '../api/putEditCommands';

const useEditCommands = () => {
  const { mutate: editCommandsMutate } = useMutation({
    mutationFn: ({ listName, updatedCommands }) =>
      putEditCommands(listName, updatedCommands),
  });

  return { editCommandsMutate };
};

export default useEditCommands;
