import { useMutation } from '@tanstack/react-query';
import postList from '../api/postList';
import { useAddListModalStore } from '../stores/ModalStore';

const useAddList = (setIsDuplicated, setIsFull) => {
  const closeAddModal = useAddListModalStore((state) => state.closeModal);

  const { mutate: addListMutate } = useMutation({
    mutationFn: ({ listTitle }) => postList(listTitle),
    onSuccess: (data) => {
      if (data.isDuplicated) return setIsDuplicated(true);
      if (data.isFull) return setIsFull(true);
      closeAddModal();
    },
  });

  return { addListMutate };
};

export default useAddList;
