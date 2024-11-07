import { useMutation } from '@tanstack/react-query';
import putEditCommands from '../api/putEditCommands';
import { useListStore } from '../stores/ListStore';

const useEditCommands = () => {
  const currentListName = useListStore((state) => state.currentListName);

  const { mutate: editCommandsMutate } = useMutation({
    mutationFn: ({ updatedCommands }) =>
      putEditCommands(currentListName, updatedCommands),
  });

  return { editCommandsMutate };
};

export default useEditCommands;
