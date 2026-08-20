import { useMutation, useQueryClient } from '@tanstack/react-query';
import putEditCommands from '../api/putEditCommands';
import {
  getListQueryKey,
  LISTS_QUERY_KEY,
} from '../constants/queryKeys';

const useEditCommands = () => {
  const queryClient = useQueryClient();
  const { mutate: editCommandsMutate } = useMutation({
    mutationFn: ({ listId, updatedCommands }) =>
      putEditCommands(listId, updatedCommands),
    onSuccess: (_data, { listId }) => {
      queryClient.invalidateQueries({ queryKey: getListQueryKey(listId) });
      queryClient.invalidateQueries({
        queryKey: LISTS_QUERY_KEY,
        exact: true,
      });
    },
  });

  return { editCommandsMutate };
};

export default useEditCommands;
