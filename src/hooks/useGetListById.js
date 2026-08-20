import { useQuery } from '@tanstack/react-query';
import getListById from '../api/getListById';
import { getListQueryKey } from '../constants/queryKeys';

const useGetListById = (listId) => {
  const { data: list, isSuccess } = useQuery({
    queryKey: getListQueryKey(listId),
    queryFn: () => getListById(listId),
    enabled: listId !== null,
  });

  return { list, isSuccess };
};

export default useGetListById;
