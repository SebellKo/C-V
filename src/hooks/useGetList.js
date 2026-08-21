import { useQuery } from '@tanstack/react-query';
import getList from '../api/getList';
import { LISTS_QUERY_KEY } from '../constants/queryKeys';

const useGetList = () => {
  const { data: list, isSuccess } = useQuery({
    queryFn: getList,
    queryKey: LISTS_QUERY_KEY,
  });

  return { list, isSuccess };
};

export default useGetList;
