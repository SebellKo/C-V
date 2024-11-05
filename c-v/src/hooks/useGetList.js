import { useQuery } from '@tanstack/react-query';
import getList from '../api/getList';

const useGetList = () => {
  const { data: list, isSuccess } = useQuery({
    queryFn: getList,
    queryKey: ['list'],
  });

  return { list, isSuccess };
};

export default useGetList;
