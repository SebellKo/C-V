import { useQuery } from '@tanstack/react-query';
import getList from '../api/getList';
import type { CommandList } from '../types/domain';

const useGetList = () => {
  const { data: list, isSuccess } = useQuery<CommandList[]>({
    queryFn: getList,
    queryKey: ['list'],
  });

  return { list, isSuccess };
};

export default useGetList;
