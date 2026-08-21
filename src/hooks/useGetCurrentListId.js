import { useQuery } from '@tanstack/react-query';
import getCurrentListId from '../api/getCurrentListId';
import { CURRENT_LIST_QUERY_KEY } from '../constants/queryKeys';

const useGetCurrentListId = () => {
  const { data: currentListId, isSuccess } = useQuery({
    queryKey: CURRENT_LIST_QUERY_KEY,
    queryFn: getCurrentListId,
  });

  return { currentListId, isSuccess };
};

export default useGetCurrentListId;
