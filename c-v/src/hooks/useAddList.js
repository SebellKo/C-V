import { useMutation } from '@tanstack/react-query';
import postList from '../api/postList';
import { useAddListModalStore } from '../stores/ModalStore';

const useAddList = (setIsDuplicated) => {
  const closeAddModal = useAddListModalStore((state) => state.closeModal);

  const { mutate: addListMutate } = useMutation({
    mutationFn: ({ listTitle }) => postList(listTitle),
    onSuccess: (data) => {
      if (data.isDuplicated) return setIsDuplicated(true);
      closeAddModal();
    },
  });

  return { addListMutate };
};

export default useAddList;
